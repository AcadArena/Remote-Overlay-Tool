import React from "react";
import { useSelector } from "react-redux";
import { Participant, ReduxState, Tournament } from "../../config/types/types";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { projectFirestore as db } from "../../config/firebase/config";

import Sheet from "../../comps/sheet/Sheet";
import SheetBody from "../../comps/sheet/SheetBody";
import SheetHead from "../../comps/sheet/SheetHead";
import SheetHeadTitle from "../../comps/sheet/SheetHeadTitle";
import SheetSection from "../../comps/sheet/SheetSection";
import SheetFooter from "../../comps/sheet/SheetFooter";
import SheetHeadSub from "../../comps/sheet/SheetHeadSub";

import EditDialog from "./ParticipantEdit";

import { makeStyles, Typography } from "@material-ui/core";
import CloudOutlinedIcon from "@material-ui/icons/CloudOutlined";

const makeCompStyles = makeStyles((theme) => ({
  participants: {
    display: "grid",
    gap: "15px",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
  },
  participant: {
    margin: 0,
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    "& .logo": {
      fontWeight: 300,
      height: 70,
      width: 70,
      marginRight: theme.spacing(3),
      backgroundSize: "contain",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
    },
  },
  details: {
    display: "flex",
    flexDirection: "column",
    "& .name": {
      fontWeight: 300,
    },
    "& .school": {
      color: "#999",
    },
  },
}));

const ParticipantsPage: React.FC = () => {
  const classes = makeCompStyles();
  const { tournament: tournamentWS } = useSelector(
    (state: ReduxState) => state.live
  );
  const tournamentRef = db.collection("tournaments").doc(tournamentWS?.url);
  const [tournamentFS, loading] = useDocumentData<Tournament>(tournamentRef);
  const [selected, setSelected] = React.useState<Participant | undefined>();
  const [editState, setEditState] = React.useState<boolean>(false);

  const editParticipant = ({
    participant,
  }: {
    participant: Participant;
  }) => () => {
    setSelected(participant);
    setEditState(true);
  };

  return (
    <div>
      <Sheet loading={loading}>
        <SheetHead>
          <SheetHeadTitle>Participants</SheetHeadTitle>
          <SheetHeadSub>
            List of teams / players for this tournament
          </SheetHeadSub>
        </SheetHead>
        <SheetBody>
          <div className={classes.participants}>
            {tournamentFS?.participants.map((p, i) => (
              <SheetSection
                key={p.id}
                className={classes.participant}
                onClick={editParticipant({ participant: p })}
              >
                <div
                  className="logo"
                  style={{
                    backgroundImage: `url(${p.logo})`,
                    border: Boolean(p.logo)
                      ? "none"
                      : "1px solid rgba(0,0,0,.1)",
                  }}
                ></div>
                <div className={classes.details}>
                  <div className="name">{p.org_name || p.display_name}</div>
                  <Typography variant="caption" className="school">
                    {p.university_name}
                  </Typography>
                </div>
              </SheetSection>
            ))}
          </div>
        </SheetBody>
        <SheetFooter>
          <CloudOutlinedIcon />
          Uses Database
        </SheetFooter>
      </Sheet>
      <EditDialog
        tournament={tournamentFS}
        participant={selected}
        open={editState}
        onClose={() => setEditState(false)}
      />
    </div>
  );
};

export default ParticipantsPage;
