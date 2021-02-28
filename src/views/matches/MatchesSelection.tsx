import { Button, makeStyles, Paper, Typography } from "@material-ui/core";
import React, { MouseEvent } from "react";
import Sheet from "../../comps/sheet/Sheet";
import SheetBody from "../../comps/sheet/SheetBody";
import SheetHead from "../../comps/sheet/SheetHead";
import SheetHeadSub from "../../comps/sheet/SheetHeadSub";
import SheetHeadTitle from "../../comps/sheet/SheetHeadTitle";
import SheetSection from "../../comps/sheet/SheetSection";
import RefreshIcon from "@material-ui/icons/Refresh";

import { Match, ReduxState } from "../../config/types/types";
import SheetFooter from "../../comps/sheet/SheetFooter";
import axios from "axios";
import { useSelector } from "react-redux";
import swal from "sweetalert";
import { projectFirestore as db } from "../../config/firebase/config";
import { wsContext } from "../../config/websocket/WebsocketProvider";
import SaveIcon from "@material-ui/icons/Save";
import CheckIcon from "@material-ui/icons/Check";

export const getFinalScore = (score: string) => {
  const scores: string[] = score.split(",");
  let team1: number = 0;
  let team2: number = 0;

  scores.forEach((s) => {
    let ss = s.match(/^(\d*)-(\d*)/);
    if (ss && parseInt(ss[1]) > parseInt(ss[2])) {
      team1 = team1 + 1;
    } else if (ss && parseInt(ss[1]) < parseInt(ss[2])) {
      team2 = team2 + 1;
    }
  });
  return `${team1} - ${team2}`;
};

const makeCompStyles = makeStyles((theme) => ({
  matches: {
    display: "grid",
    gap: "10px",
    gridTemplateColumns: "repeat(auto-fill, minmax(500px, 1fr))",
  },
  match: {
    padding: theme.spacing(2, 4),
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    transition: "100ms ease-out",
    position: "relative",

    "&:hover": {
      border: "1px solid rgba(0,0,0,.75)",
    },

    "& .vs": {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      margin: theme.spacing(0, 2),

      "& .score": {
        color: "#999",
      },
    },

    "& .team": {
      flex: 1,
      display: "flex",
      alignItems: "center",
      "& .logo": {
        height: 50,
        width: 50,
        border: "1px solid rgba(0,0,0,.1)",
        borderRadius: 3,
        margin: theme.spacing(0, 2),
        backgroundSize: "contain",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      },
    },

    "& .t1": {
      justifyContent: "flex-end",
      "& .name": {
        textAlign: "right",
      },
    },
  },
  groupstage: {
    marginTop: 40,
    border: "1px solid rgba(67,160,71,.5)",
  },
  finalStage: {
    marginTop: 40,
    border: "1px solid rgba(142, 36, 170,.5)",
  },
  round: {
    marginTop: 40,
    border: "1px solid 	rgba(67,160,71,.5)",
    // padding: theme.spacing(3),
    // marginBottom: theme.spacing(3),
  },
  roundFinalStage: {
    marginTop: 40,
    border: "1px solid 	rgba(142, 36, 170,.5)",
    // padding: theme.spacing(3),
    // marginBottom: theme.spacing(3),
  },
  actions: {
    display: "flex",
    margin: theme.spacing(2, 0),
    "& > *": {
      marginRight: theme.spacing(2),
    },
  },

  schedule: {
    display: "flex",
    flexDirection: "column",
  },
  badge: {
    position: "absolute",
    top: -15,
    right: -15,
    height: 30,
    width: 30,
    borderRadius: "50%",
    display: "flex",
    backgroundColor: theme.palette.primary.main,
    color: "#f9f9f9",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
  },
}));

const MatchesSelection = () => {
  const classes = makeCompStyles();
  const [matches, setMatches] = React.useState<Match[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const { tournament, match: matchWS, matches_today = [] } = useSelector(
    (state: ReduxState) => state.live
  );
  const [selected, setSelected] = React.useState<Match | undefined>();
  const ws = React.useContext(wsContext);

  React.useEffect(() => {
    if (!tournament?.matches) return;
    setMatches(tournament.matches);
  }, [tournament?.matches, setMatches]);

  React.useEffect(() => {
    if (!matchWS) return;
    setSelected(matchWS);
  }, [matchWS, setSelected]);

  const getMatches = async () => {
    setLoading(true);
    let isMounted = true;
    axios
      .get<{ match: Match }[]>(
        `https://api.challonge.com/v1/tournaments/${tournament?.url}/matches.json?api_key=J4V1S6QqJQS6FFcHUKoq6zI3P1r0sddPxB7zcCbC`
      )
      .then(({ data }) => {
        if (isMounted) {
          setLoading(false);
          setMatches(data.map((d) => d.match));
        }
      })
      .catch((err) => {
        swal({
          title: "Something went wrong",
          text: err.message,
          icon: "error",
        });
      });
    return () => {
      isMounted = false;
    };
  };

  const save = () => {
    setLoading(true);
    db.collection("tournaments")
      .doc(tournament?.url)
      .set({ ...tournament, matches: matches })
      .then(() => {
        setLoading(false);
        ws.setLiveSettings({ tournament: { ...tournament, matches: matches } });
      });
  };

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

  const selectMatch = (m: Match) => (e: MouseEvent) => {
    if (e.ctrlKey) {
      if (!matches_today.some((mm) => mm.id === m.id)) {
        ws.setLiveSettings({ matches_today: [...matches_today, m] });
      } else {
        ws.setLiveSettings({
          matches_today: matches_today.filter((mm) => mm.id !== m.id),
        });
      }
    } else {
      ws.setLiveSettings({ match: m });
    }
  };

  const findScheduleIndex = (m: Match): number => {
    return matches_today.findIndex((mm) => mm.id === m.id);
  };

  return (
    <Sheet loading={loading}>
      <SheetHead>
        <SheetHeadTitle>Matches</SheetHeadTitle>
        <SheetHeadSub>Match Directory</SheetHeadSub>
      </SheetHead>
      <SheetBody>
        {/* ACTIONS */}
        <SheetSection>
          <Typography variant="h4">Actions</Typography>
          <div className={classes.actions}>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={getMatches}
            >
              Refresh
            </Button>
            <Button
              color="primary"
              variant="contained"
              disabled={matches === tournament?.matches}
              startIcon={
                matches === tournament?.matches ? <CheckIcon /> : <SaveIcon />
              }
              onClick={save}
            >
              Save
            </Button>
          </div>
        </SheetSection>

        {/* SelectedMatch */}
        {matchWS && (
          <SheetSection>
            <Typography variant="h4">Selected Match</Typography>
            <div className="">
              <Paper className={classes.match} variant="outlined">
                {/* Team1 */}
                <div className="t1 team">
                  <div className="name">
                    {getTeamName(matchWS?.player1_id ?? 0)}
                  </div>
                  <div
                    className="logo"
                    style={{
                      backgroundImage: `url(${getTeamLogo(
                        matchWS?.player1_id ?? 0
                      )})`,
                      border: Boolean(getTeamLogo(matchWS?.player1_id ?? 0))
                        ? "none"
                        : "",
                    }}
                  ></div>
                </div>

                {/* VS */}
                <div className="vs">
                  <Typography className="text">VS</Typography>
                  <Typography variant="caption" className="score">
                    {getFinalScore(matchWS?.scores_csv ?? "")}
                  </Typography>
                </div>

                {/* Team 2 */}
                <div className="t2 team">
                  <div
                    className="logo"
                    style={{
                      backgroundImage: `url(${getTeamLogo(
                        matchWS?.player2_id ?? 0
                      )})`,
                      border: Boolean(getTeamLogo(matchWS?.player2_id ?? 0))
                        ? "none"
                        : "",
                    }}
                  ></div>
                  <div className="name">
                    {getTeamName(matchWS?.player2_id ?? 0)}
                  </div>
                </div>
              </Paper>
            </div>
          </SheetSection>
        )}

        {/* SCHEDULE */}
        <SheetSection>
          <Typography variant="h4">Schedule</Typography>
          <div className={classes.schedule}>
            {matches_today.length
              ? matches_today.map((match) => (
                  <Paper
                    className={classes.match}
                    variant="outlined"
                    onClick={() =>
                      ws.setLiveSettings({
                        matches_today: matches_today.filter(
                          (mm) => mm.id !== match.id
                        ),
                      })
                    }
                  >
                    {/* Team1 */}
                    <div className="t1 team">
                      <div className="name">
                        {getTeamName(match.player1_id ?? 0)}
                      </div>
                      <div
                        className="logo"
                        style={{
                          backgroundImage: `url(${getTeamLogo(
                            match.player1_id ?? 0
                          )})`,
                          border: Boolean(getTeamLogo(match.player1_id ?? 0))
                            ? "none"
                            : "",
                        }}
                      ></div>
                    </div>

                    {/* VS */}
                    <div className="vs">
                      <Typography className="text">VS</Typography>
                      <Typography variant="caption" className="score">
                        {getFinalScore(match.scores_csv ?? "")}
                      </Typography>
                    </div>

                    {/* Team 2 */}
                    <div className="t2 team">
                      <div
                        className="logo"
                        style={{
                          backgroundImage: `url(${getTeamLogo(
                            match.player2_id ?? 0
                          )})`,
                          border: Boolean(getTeamLogo(match.player2_id ?? 0))
                            ? "none"
                            : "",
                        }}
                      ></div>
                      <div className="name">
                        {getTeamName(match.player2_id ?? 0)}
                      </div>
                    </div>
                  </Paper>
                ))
              : "No Matches Scheduled"}
          </div>
        </SheetSection>
        {Boolean(matches.length) && (
          <>
            {/* ========================================================================== GROUP STAGE */}
            <Sheet className={classes.groupstage}>
              <SheetHead color="green" style={{ alignSelf: "flex-start" }}>
                <SheetHeadTitle>Group Stage</SheetHeadTitle>
              </SheetHead>
              <SheetBody>
                {Array.from(
                  new Set(
                    matches
                      .filter((m) => Boolean(m.group_id))
                      .map((m) => m.round)
                  )
                ).map((round) => (
                  // ========================================================== Round
                  <Sheet className={classes.round} key={round}>
                    <SheetHead
                      color="green"
                      style={{ alignSelf: "flex-start" }}
                    >
                      <SheetHeadTitle>Round {round}</SheetHeadTitle>
                    </SheetHead>
                    <SheetBody className={classes.matches}>
                      {matches
                        .filter((m) => Boolean(m.group_id))
                        .filter((m) => m.round === round)
                        .map((match) => (
                          // ============================================================= Match
                          <Paper
                            className={classes.match}
                            variant="outlined"
                            key={match.id}
                            onClick={selectMatch(match)}
                            style={{
                              border:
                                match.id === matchWS?.id
                                  ? "1px solid #000"
                                  : "",
                            }}
                          >
                            {/* Team1 */}
                            <div className="t1 team">
                              <div className="name">
                                {getTeamName(match.player1_id)}
                              </div>
                              <div
                                className="logo"
                                style={{
                                  backgroundImage: `url(${getTeamLogo(
                                    match.player1_id
                                  )})`,
                                  border: Boolean(getTeamLogo(match.player1_id))
                                    ? "none"
                                    : "",
                                }}
                              ></div>
                            </div>

                            {/* VS */}
                            <div className="vs">
                              <Typography className="text">VS</Typography>
                              <Typography variant="caption" className="score">
                                {getFinalScore(match.scores_csv)}
                              </Typography>
                            </div>

                            {/* Team 2 */}
                            <div className="t2 team">
                              <div
                                className="logo"
                                style={{
                                  backgroundImage: `url(${getTeamLogo(
                                    match.player2_id
                                  )})`,
                                  border: Boolean(getTeamLogo(match.player2_id))
                                    ? "none"
                                    : "",
                                }}
                              ></div>
                              <div className="name">
                                {getTeamName(match.player2_id)}
                              </div>
                            </div>

                            {findScheduleIndex(match) !== -1 && (
                              <div className={classes.badge}>
                                {findScheduleIndex(match) + 1}
                              </div>
                            )}
                          </Paper>
                        ))}
                    </SheetBody>
                  </Sheet>
                ))}
              </SheetBody>
            </Sheet>
            {/* ========================================================================== FINAL STAGE */}
            <Sheet className={classes.finalStage}>
              <SheetHead color="blue" style={{ alignSelf: "flex-start" }}>
                <SheetHeadTitle>Final Stage / Playoffs</SheetHeadTitle>
              </SheetHead>
              <SheetBody>
                {Array.from(
                  new Set(
                    matches
                      .filter((m) => !Boolean(m.group_id))
                      .map((m) => m.round)
                  )
                ).map((round) => (
                  // ========================================================== Round
                  <Sheet className={classes.roundFinalStage} key={round}>
                    <SheetHead color="blue" style={{ alignSelf: "flex-start" }}>
                      <SheetHeadTitle>Round {round}</SheetHeadTitle>
                    </SheetHead>
                    <SheetBody className={classes.matches}>
                      {matches
                        .filter((m) => !Boolean(m.group_id))
                        .filter((m) => m.round === round)
                        .map((match) => (
                          // ============================================================= Match
                          <Paper
                            className={classes.match}
                            variant="outlined"
                            key={match.id}
                            onClick={selectMatch(match)}
                            style={{
                              border:
                                match.id === matchWS?.id
                                  ? "1px solid #000"
                                  : "",
                            }}
                          >
                            <div className="info"></div>
                            <div className="t1 team">
                              <div className="name">
                                {getTeamName(match.player1_id)}
                              </div>
                              <div
                                className="logo"
                                style={{
                                  backgroundImage: `url(${getTeamLogo(
                                    match.player1_id
                                  )})`,
                                  border: Boolean(getTeamLogo(match.player1_id))
                                    ? "none"
                                    : "",
                                }}
                              ></div>
                            </div>
                            <div className="vs">
                              <Typography className="text">VS</Typography>
                              <Typography variant="caption" className="score">
                                {getFinalScore(match.scores_csv)}
                              </Typography>
                            </div>
                            <div className="t2 team">
                              <div
                                className="logo"
                                style={{
                                  backgroundImage: `url(${getTeamLogo(
                                    match?.player2_id
                                  )})`,
                                  border: Boolean(getTeamLogo(match?.playe2_id))
                                    ? "none"
                                    : "",
                                }}
                              ></div>
                              <div className="name">
                                {getTeamName(match.player2_id)}
                              </div>
                            </div>
                            {findScheduleIndex(match) !== -1 && (
                              <div className={classes.badge}>
                                {findScheduleIndex(match) + 1}
                              </div>
                            )}
                          </Paper>
                        ))}
                    </SheetBody>
                  </Sheet>
                ))}
              </SheetBody>
            </Sheet>
          </>
        )}
      </SheetBody>
      <SheetFooter>Fetched from challonge and saved to database</SheetFooter>
    </Sheet>
  );
};

export default MatchesSelection;
