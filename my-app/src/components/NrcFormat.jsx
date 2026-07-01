import { useState } from "react";
import * as mmNrc from "mm-nrc";

const [stateId, setStateId] = useState("");
const [township, setTownship] = useState("");
const [type, setType] = useState("");
const [number, setNumber] = useState("");

const states = mmNrc.getNrcStates();
const types = mmNrc.getNrcTypes();
const townships = stateId
  ? mmNrc.getNrcTownshipsByStateId(stateId)
  : [];

  const fullNrc =
  stateId && township && type && number
    ? `${stateId}/${township}(${type})${number}`
    : "";