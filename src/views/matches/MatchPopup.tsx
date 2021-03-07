import { Button, Dialog, makeStyles, Typography } from "@material-ui/core";
import React from "react";
import { useSelector } from "react-redux";
import Sheet from "../../comps/sheet/Sheet";
import SheetBody from "../../comps/sheet/SheetBody";
import SheetHead from "../../comps/sheet/SheetHead";
import SheetHeadSub from "../../comps/sheet/SheetHeadSub";
import SheetHeadTitle from "../../comps/sheet/SheetHeadTitle";
import { Match, ReduxState } from "../../config/types/types";
import { wsContext } from "../../config/websocket/WebsocketProvider";
import axios from "axios";
import { projectFirestore } from "../../config/firebase/config";
import swal from "sweetalert";
import SheetSection from "../../comps/sheet/SheetSection";
import TextField from "../../comps/textfield/TextField";
import ControlMatchPopupVeto from "../lowerthirds/ControlMatchPopupVeto";

interface ControlMatchPopupProps {
  open: boolean;
  match?: Match;
  onClose: () => void;
  title: string;
}

const ms = makeStyles((theme) => ({
  dialog: {
    boxShadow: "none",
    backgroundColor: "transparent",
  },
  content: {
    display: "flex",
    flexDirection: "column",

    "& > *": {
      marginBottom: theme.spacing(2),
    },
  },

  scores: {
    marginTop: theme.spacing(2),
    "& > *": {
      margin: "5px 5px",
    },
  },
  actions: {
    display: "flex",
    flexWrap: "wrap",
    "& > *": {
      margin: 5,
    },
  },
}));

const ControlMatchPopup: React.FC<ControlMatchPopupProps> = ({
  open,
  match,
  onClose,
  title,
}) => {
  const c = ms();
  const { tournament, matches_today, match: matchWS } = useSelector(
    (state: ReduxState) => state.live
  );
  const ws = React.useContext(wsContext);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [scores, setScores] = React.useState<string>("0-0");
  const [vetoState, setVetoState] = React.useState<boolean>(false);
  const [badge, setBadge] = React.useState<string>("");

  React.useEffect(() => {
    if (!match) return;
    setScores(match?.scores_csv || "0-0");
    setBadge(match?.badge ?? "");
  }, [match, setScores]);

  const selectMatch = () => {
    ws.setLiveSettings({ match: match });
    onClose();
  };

  const refresh = () => {
    const apiKey = "J4V1S6QqJQS6FFcHUKoq6zI3P1r0sddPxB7zcCbC";
    const username = "manoku";
    setLoading(true);
    axios
      .get(
        `https://api.challonge.com/v1/tournaments/${tournament?.id}/matches/${match?.id}.json?api_key=${apiKey}`
      )
      .then(({ data: { match: matchAxios } }: { data: { match: Match } }) => {
        setLoading(false);
        projectFirestore
          .collection("tournaments")
          .doc(tournament?.url)
          .set({
            ...tournament,
            matches: tournament?.matches?.map((m) =>
              m.id === match?.id
                ? { ...m, scores_csv: matchAxios.scores_csv || "0-0" }
                : m
            ),
          })
          .then(() => {
            setScores(matchAxios.scores_csv);
            ws.setLiveSettings({
              tournament: {
                ...tournament,
                matches: tournament?.matches?.map((m) =>
                  m.id === match?.id
                    ? { ...m, scores_csv: matchAxios.scores_csv || "0-0" }
                    : m
                ),
              },
              matches_today: matches_today?.map((m) =>
                m.id === matchAxios?.id
                  ? { ...m, scores_csv: matchAxios.scores_csv || "0-0" }
                  : m
              ),
              match:
                matchWS?.id === matchAxios.id
                  ? { ...matchWS, scores_csv: matchAxios.scores_csv || "0-0" }
                  : matchWS,
            });
            onClose();
          });
      })
      .catch((err) => {
        setLoading(false);
        swal({
          title: "Something Went Wrong",
          text: err.message,
          icon: "error",
        });
      });
  };

  const handleChange = (playerIndex: number, scoreIndex: number) => ({
    currentTarget: { value },
  }: React.ChangeEvent<HTMLInputElement>) => {
    let scoreArray = scores.split(",").map((s, i) => {
      if (i !== scoreIndex) return s;
      let ss = s.match(/^(\d*)-(\d*)/);
      let SSSarray = ss
        ?.map((sss, ii) => {
          if (ii !== playerIndex) return sss;
          return parseInt(value);
        })
        .filter((sss) => sss !== s);

      return SSSarray?.join("-");
    });
    setScores(scoreArray.join(","));
  };

  const apply = () => {
    ws.setLiveSettings({
      tournament: {
        ...tournament,
        matches: tournament?.matches.map((m) =>
          m.id === match?.id
            ? {
                ...m,
                scores_csv: scores,
                badge: badge,
              }
            : m
        ),
      },
      matches_today: matches_today?.map((m) =>
        m.id === match?.id ? { ...m, scores_csv: scores, badge: badge } : m
      ),
      match:
        matchWS?.id === match?.id
          ? { ...matchWS, scores_csv: scores, badge: badge }
          : matchWS,
    });
    onClose();
  };

  const addMatch = () => {
    setScores(scores + ",0-0");
  };

  const addSchedule = () => {
    ws.setLiveSettings({ matches_today: [...(matches_today ?? []), match] });
    onClose();
  };

  return (
    <Dialog open={open} classes={{ paper: c.dialog }} onClose={onClose}>
      <Sheet loading={loading}>
        <SheetHead color="red">
          <SheetHeadTitle>Match</SheetHeadTitle>
          <SheetHeadSub>{title}</SheetHeadSub>
        </SheetHead>
        <SheetBody className={c.content}>
          <SheetSection>
            <Typography variant="h4">Actions</Typography>
            <div className={c.actions}>
              <Button
                color="primary"
                variant="contained"
                onClick={selectMatch}
                disabled={match?.id === matchWS?.id}
              >
                Select This Match
              </Button>
              <Button
                color="primary"
                variant="contained"
                onClick={addSchedule}
                disabled={matches_today?.some((m) => m.id === match?.id)}
              >
                Add to Schedule
              </Button>
              <Button color="secondary" variant="contained" onClick={refresh}>
                Fetch Score
              </Button>
              <Button variant="contained" onClick={() => setVetoState(true)}>
                Veto ({match?.veto?.length ?? 0})
              </Button>
            </div>
          </SheetSection>

          <SheetSection>
            <Typography>Manual Scores</Typography>
            {scores.split(",").map((score, i) => {
              let ss = score.match(/^(\d*)-(\d*)/);
              let team1 = ss?.length ? ss[1] : 0;
              let team2 = ss?.length ? ss[2] : 0;
              return (
                <div className={c.scores} key={i}>
                  <TextField
                    label="Team 1 Score"
                    value={team1}
                    onChange={handleChange(1, i)}
                    type="number"
                  />
                  <TextField
                    label="Team 2 Score"
                    value={team2}
                    onChange={handleChange(2, i)}
                    type="number"
                  />
                </div>
              );
            })}
            <Button
              variant="outlined"
              color="primary"
              style={{ marginTop: 10 }}
              onClick={addMatch}
              fullWidth
            >
              Add Match
            </Button>
          </SheetSection>
          <SheetSection>
            <Typography variant="h4">Schedule (text)</Typography>
            <TextField
              value={badge}
              onChange={({ currentTarget: { value } }) => setBadge(value)}
            />
          </SheetSection>
          <Button
            variant="contained"
            color="primary"
            style={{ marginTop: 10 }}
            onClick={apply}
            fullWidth
          >
            Apply Changes
          </Button>
        </SheetBody>
      </Sheet>
      <ControlMatchPopupVeto
        open={vetoState}
        match={match}
        title={title}
        onClose={() => setVetoState(false)}
      />
    </Dialog>
  );
};

export default ControlMatchPopup;
