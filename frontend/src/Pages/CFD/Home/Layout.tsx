import { LogoutOutlined } from "@ant-design/icons";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "antd";
import { PropsWithChildren } from "react";

import { assetsPath } from "../../../helpers/assets";
import { Router } from "../../../Routes";
import { useCFDConfigStore } from "../../../stores/useCFDConfigStore";
import { useCFDSessionStore } from "../../../stores/useCFDSessionStore";

export const Layout = ({ children }: PropsWithChildren) => {
  const queryClient = useQueryClient();

  const destroy = useCFDSessionStore((s) => s.destroy);
  const reset = useCFDConfigStore((s) => s.reset);

  const onLogout = () => {
    queryClient.clear();
    destroy();
    reset();

    Router.push("CFDLogin");
  };

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
        <Button icon={<LogoutOutlined />} onClick={onLogout} size="large" />
      </div>

      {children}
    </div>
  );
};
