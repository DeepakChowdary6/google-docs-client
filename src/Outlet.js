import React from 'react';
import {Navigate} from 'react-router-dom'
import {v4 as uuidV4} from "uuid";
function Outlet() {
    return (<>
        <Navigate to={`/documents/${uuidV4()}`} />
    </>);
}

export default Outlet;