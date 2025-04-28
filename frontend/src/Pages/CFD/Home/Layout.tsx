import { LogoutOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { PropsWithChildren } from "react";

import { logout } from "../../../api/cfd";
import { assetsPath } from "../../../helpers/assets";

export const Layout = ({ children }: PropsWithChildren) => {
  return (
    <div
      className="h-screen w-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url("${assetsPath("cfd/background.jpg")}")` }}
    >
      <div className="fixed inset-0 bg-black/50" />

      <img
        className="fixed inset-3 h-14"
        src={assetsPath("logo/horizontal.png")}
      />

      <div className="fixed bottom-5 left-5 opacity-20">
        <Button icon={<LogoutOutlined />} onClick={logout} size="large" />
      </div>

      {children}
    </div>
  );
};
