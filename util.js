import persons from "./persons.js";

let ID = persons
    .map(it => Number(it.id))
    .reduce((previous, current) => previous > current ? previous : current);

export const supplyId = () => ++ID;