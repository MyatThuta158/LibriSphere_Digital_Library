import React from "react";

function IsSystemUser() {
  const user = localStorage.getItem("user"); ///----This get user from local storatge----//
  const isMember = user !== null;

  return { user, isMember };
}

export default IsSystemUser;
