import {
  makeStyles,
  Paper,
  Avatar,
  Badge,
  Typography,
  Chip,
  Button,
} from "@material-ui/core";
import React from "react";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { useSelector } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router-dom";
import Sheet from "../../comps/sheet/Sheet";
import SheetBody from "../../comps/sheet/SheetBody";
import SheetFooter from "../../comps/sheet/SheetFooter";
import SheetHead from "../../comps/sheet/SheetHead";
import SheetHeadTitle from "../../comps/sheet/SheetHeadTitle";
import SheetSection from "../../comps/sheet/SheetSection";
import { projectFirestore as db } from "../../config/firebase/config";
import { Caster, ReduxState } from "../../config/types/types";
import { wsContext } from "../../config/websocket/WebsocketProvider";

interface CasterSelectionProps extends RouteComponentProps {
  alt?: boolean;
}

const makeCompStyles = makeStyles((theme) => ({
  casters: {
    display: "grid",
    gap: "10px",
    gridTemplateColumns: "repeat(auto-fill, minmax(115px, 1fr))",
  },
  caster: {
    padding: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    position: "relative",
    "& .name": { marginTop: 10 },
    "& .ign": { color: "#999" },
    "& .photo": {
      height: theme.spacing(20),
      width: theme.spacing(20),
    },
    "& .badge": {
      position: "absolute",
      borderRadius: "50%",
      height: 30,
      width: 30,
      backgroundColor: theme.palette.primary.main,
      top: -15,
      right: -15,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      color: "#fff",
      zIndex: 10,
    },
  },
  body: {
    display: "flex",
    flexDirection: "column",
  },
}));

const CasterSelection: React.FC<CasterSelectionProps> = ({ history, alt }) => {
  const classes = makeCompStyles();
  const { tournament, casters: castersWS, casters_alt } = useSelector(
    (state: ReduxState) => state.live
  );
  const ws = React.useContext(wsContext);
  const [selection, setSelection] = React.useState<Caster[]>([]);
  const [castersDoc, loading] = useDocumentData<{ list: Caster[] }>(
    db
      .collection("tournaments")
      .doc(tournament?.url)
      .collection("live")
      .doc("casters")
  );

  React.useEffect(() => {
    if (!castersWS && !casters_alt) return;
    if (alt) {
      setSelection(casters_alt ?? []);
    } else {
      setSelection(castersWS ?? []);
    }
  }, [casters_alt, castersWS, setSelection]);

  const handleClick = (caster: Caster) => () => {
    if (selection.some((c) => c.ign === caster.ign)) {
      setSelection(selection.filter((c) => c.ign !== caster.ign));
    } else {
      setSelection([...selection, caster]);
    }
  };

  const removeCaster = (caster: Caster) => () => {
    setSelection(selection.filter((c) => c.ign !== caster.ign));
  };

  const getSelectionIndex = (caster: Caster) => {
    if (selection.some((c) => c.ign === caster.ign)) {
      return selection.findIndex((c) => c.ign === caster.ign) + 1;
    }
  };

  const apply = () => {
    if (!alt) {
      ws.setLiveSettings({ casters: selection });
    } else {
      ws.setLiveSettings({ casters_alt: selection });
    }
  };

  return (
    <Sheet loading={loading}>
      <SheetHead color={alt ? "blue" : "red"}>
        <SheetHeadTitle>
          Broadcast Casters {alt ? "Alternate" : "Main"}
        </SheetHeadTitle>
      </SheetHead>
      <SheetBody className={classes.body}>
        <div className={classes.casters}>
          {Boolean(castersDoc?.list?.length) ? (
            castersDoc?.list.map((caster) => (
              <Paper
                key={caster.ign}
                className={classes.caster}
                variant="outlined"
                onClick={handleClick(caster)}
              >
                <Avatar
                  variant="rounded"
                  src={caster.photo}
                  className="photo"
                />
                <Typography align="center" className="name">
                  {caster.name}
                </Typography>
                <Typography align="center" variant="caption" className="ign">
                  {caster.ign}
                </Typography>
                {Boolean(getSelectionIndex(caster)) && (
                  <div className="badge">{getSelectionIndex(caster)}</div>
                )}
              </Paper>
            ))
          ) : (
            <div>No Casters set</div>
          )}
        </div>

        {Boolean(selection?.length) && (
          <SheetSection style={{ marginTop: 20 }}>
            <Typography variant="h4">Selection</Typography>
            <div className="list">
              {selection.map((caster) => (
                <Chip
                  key={caster.ign}
                  label={caster.ign}
                  onDelete={removeCaster(caster)}
                  style={{ marginRight: 5 }}
                  avatar={<Avatar src={caster.photo} alt={caster.ign} />}
                />
              ))}
            </div>
          </SheetSection>
        )}

        <Button
          style={{ alignSelf: "center", marginTop: selection?.length ? 0 : 20 }}
          variant="outlined"
          color="primary"
          disabled={alt ? casters_alt === selection : castersWS === selection}
          onClick={apply}
        >
          Apply
        </Button>
      </SheetBody>
      <SheetFooter>
        add ?alt=1 to url to activate the alternate casters
      </SheetFooter>
    </Sheet>
  );
};

export default withRouter(CasterSelection);
