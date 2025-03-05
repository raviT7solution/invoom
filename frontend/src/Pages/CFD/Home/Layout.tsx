import { LogoutOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { PropsWithChildren } from "react";

import { logout } from "../../../api/cfd";
import { assetsPath } from "../../../helpers/assets";

export const Layout = ({ children }: PropsWithChildren) => {
  return (
    <div
      className="h-screen w-screen bg-center bg-cover bg-no-repeat"
      style={{ backgroundImage: `url("${assetsPath("cfd/background.jpg")}")` }}
    >
      <div className="fixed inset-0 bg-black/50" />

      <img
        className="fixed h-14 inset-3"
        src={assetsPath("logo/horizontal.png")}
      />

      <div className="fixed opacity-20 bottom-5 left-5">
        <Button icon={<LogoutOutlined />} onClick={logout} size="large" />
      </div>

      {children}
    </div>
  );
};
