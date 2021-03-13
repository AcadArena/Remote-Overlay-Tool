import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  makeStyles,
  Typography,
} from "@material-ui/core";
import React, { MouseEvent } from "react";
import { useSelector } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router-dom";
import Sheet from "../../comps/sheet/Sheet";
import SheetBody from "../../comps/sheet/SheetBody";
import SheetHead from "../../comps/sheet/SheetHead";
import SheetSection from "../../comps/sheet/SheetSection";
import { Match, ReduxState } from "../../config/types/types";
import { getFinalScore } from "../matches/MatchesSelection";
import RefreshIcon from "@material-ui/icons/Refresh";
import axios from "axios";
import swal from "sweetalert";
import { wsContext } from "../../config/websocket/WebsocketProvider";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { projectFirestore } from "../../config/firebase/config";
import ControlMatchPopup from "../../comps/dialogs/ControlMatchPopup";
import RadioButton from "../../comps/radiobutton/RadioButton";
import SheetHeadTitle from "../../comps/sheet/SheetHeadTitle";

const ms = makeStyles((theme) => ({
  match: {
    display: "flex",
    alignItems: "center",
    margin: theme.spacing(2, 0),
    padding: theme.spacing(2, 0),
    border: "1px solid rgba(0,0,0,.1)",
    "& .info": {
      display: "flex",
      alignItems: "center",
      width: "100%",

      "& .vs": {
        width: 50,
        textAlign: "center",
        fontWeight: "bold",
      },

      "& .team": {
        flex: 1,
        display: "flex",
        alignItems: "center",

        "& .logo": {
          height: 50,
          width: 50,
          backgroundPosition: "center",
          backgroundSize: "80%",
          backgroundRepeat: "no-repeat",
          borderRadius: 3,
          filter: "drop-shadow(0px 4px 4px rgba(0,0,0,.5))",
        },

        "& .name": {
          padding: theme.spacing(2),
        },
      },

      "& .left": {
        "& .name": {
          textAlign: "right",
          flex: 1,
        },
      },
    },

    "& .score": {
      width: 50,
    },
  },
  current: {
    cursor: "pointer",
    "&:hover": { backgroundColor: "#f9f9f9" },
  },
  schedule: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    "& .match": {
      cursor: "pointer",
      width: "100%",
      "&:hover": {
        backgroundColor: "#f9f9f9",
      },
    },
  },
  hiddenWhenBig: {
    [theme.breakpoints.up("md")]: {
      display: "none",
    },
  },
}));

const ControlMatch: React.FC<RouteComponentProps> = ({ history }) => {
  const c = ms();
  const {
    match,
    tournament,
    matches_today = [],
    match_live = false,
  } = useSelector((state: ReduxState) => state.live);
  const ws = React.useContext(wsContext);
  const [loading, setLoading] = React.useState<boolean>(false);
  const getTeamName = (id: number) => {
    return (
      tournament?.participants.find((p) => p.id === id)?.org_name ??
      tournament?.participants.find((p) => p.id === id)?.display_name ??
      tournament?.participants.find((p) => p.group_player_ids.includes(id))
        ?.org_name ??
      tournament?.participants.find((p) => p.group_player_ids.includes(id))
        ?.display_name ??
      "TBD"
    );
  };
  const getTeamLogo = (id: number) => {
    return (
      tournament?.participants.find((p) => p.id === id)?.logo ??
      tournament?.participants.find((p) => p.group_player_ids.includes(id))
        ?.logo
    );
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
        console.log(matchAxios.scores_csv);
        projectFirestore
          .collection("tournaments")
          .doc(tournament?.url)
          .set({
            ...tournament,
            matches: tournament?.matches?.map((m) =>
              m.id === match?.id
                ? { ...m, scores_csv: matchAxios.scores_csv }
                : m
            ),
          })
          .then(() => {
            ws.setLiveSettings({
              tournament: {
                ...tournament,
                matches: tournament?.matches?.map((m) =>
                  m.id === match?.id
                    ? { ...m, scores_csv: matchAxios.scores_csv }
                    : m
                ),
              },
            });
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

  const [state, setState] = React.useState<boolean>(false);
  const [selected, setSelected] = React.useState<Match | undefined>(undefined);

  const openMatchDialog = (m?: Match) => (e: MouseEvent) => {
    setSelected(m);
    setState(true);
  };

  return (
    <Sheet loading={loading}>
      <SheetHead color="orange">
        <SheetHeadTitle>Match</SheetHeadTitle>
      </SheetHead>
      <SheetBody>
        <RadioButton
          checked={match_live}
          label="Replace Lower Thirds"
          style={{ marginBottom: 10 }}
          onClick={() => ws.setLiveSettings({ match_live: !match_live })}
        ></RadioButton>
        <Button
          variant="outlined"
          onClick={() => history.push("/matches")}
          style={{ marginBottom: 10 }}
        >
          Go to matches
        </Button>
        <SheetSection
          className={c.hiddenWhenBig}
          style={{ border: "1px solid rgba(0,0,0,.25)" }}
        >
          <Typography variant="h4">Current Match</Typography>
          <div style={{ display: "flex" }}>
            <Button
              variant="contained"
              onClick={refresh}
              startIcon={<RefreshIcon />}
              color="primary"
            >
              Fetch Score
            </Button>
          </div>
          {Boolean(match) ? (
            <div
              className={c.match + " " + c.current}
              onClick={openMatchDialog(match)}
            >
              <div className="info">
                <div className="team left">
                  <div className="name">
                    {getTeamName(match?.player1_id ?? 0)}
                  </div>
                  <div
                    className="logo"
                    style={{
                      backgroundImage: `url(${getTeamLogo(
                        match?.player1_id ?? 0
                      )})`,
                    }}
                  ></div>
                </div>
                <div className="vs">VS</div>
                <div className="team right">
                  <div
                    className="logo"
                    style={{
                      backgroundImage: `url(${getTeamLogo(
                        match?.player2_id ?? 0
                      )})`,
                    }}
                  ></div>

                  <div className="name">
                    {getTeamName(match?.player2_id ?? 0)}
                  </div>
                </div>
              </div>
              <div className="score">
                {getFinalScore(match?.scores_csv ?? "")}
              </div>
            </div>
          ) : (
            "No Match Selected"
          )}
        </SheetSection>
        <SheetSection className={c.hiddenWhenBig} style={{ padding: 0 }}>
          <Accordion expanded style={{ boxShadow: "none" }}>
            {/* <AccordionSummary expandIcon={<ExpandMoreIcon />}> */}
            <AccordionSummary>
              <Typography variant="h4">Schedule</Typography>
            </AccordionSummary>

            <AccordionDetails>
              <div className={c.schedule}>
                {matches_today.map((m) => (
                  <div
                    className={c.match + " match"}
                    onClick={openMatchDialog(m)}
                    key={m.id}
                  >
                    <div className="info">
                      <div className="team left">
                        <div className="name">
                          {getTeamName(m?.player1_id ?? 0)}
                        </div>
                        <div
                          className="logo"
                          style={{
                            backgroundImage: `url(${getTeamLogo(
                              m?.player1_id ?? 0
                            )})`,
                          }}
                        ></div>
                      </div>
                      <div className="vs">VS</div>
                      <div className="team right">
                        <div
                          className="logo"
                          style={{
                            backgroundImage: `url(${getTeamLogo(
                              m?.player2_id ?? 0
                            )})`,
                          }}
                        ></div>

                        <div className="name">
                          {getTeamName(m?.player2_id ?? 0)}
                        </div>
                      </div>
                    </div>
                    <div className="score">
                      {getFinalScore(m?.scores_csv ?? "")}
                    </div>
                  </div>
                ))}
              </div>
            </AccordionDetails>
          </Accordion>
        </SheetSection>
      </SheetBody>
      <ControlMatchPopup
        open={state}
        match={selected}
        onClose={() => setState(false)}
        title={`${getTeamName(selected?.player1_id || 0)} VS ${getTeamName(
          selected?.player2_id || 0
        )}`}
      />
    </Sheet>
  );
};

export default withRouter(ControlMatch);
