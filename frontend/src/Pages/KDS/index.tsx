import { Button } from "antd";

import { Router } from "../../Routes";
import { useKDSSessionStore } from "../../stores/useKDSSessionStore";

export const KDS = () => {
  const destroy = useKDSSessionStore((s) => s.destroy);

  const onLogout = () => {
    destroy();

    Router.push("Login");
  };

  return <Button onClick={onLogout}>Logout</Button>;
};
