import { Modal, Spin } from "antd";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  footer: ReactNode;
  isFetching: boolean;
  onCancel: () => void;
  open: boolean;
  title: ReactNode;
  width?: number;
};

export const FormModal = ({
  children,
  footer,
  isFetching,
  onCancel,
  open,
  title,
  width,
}: Props) => {
  return (
    <Modal
      destroyOnClose
      footer={<div className="flex justify-end">{footer}</div>}
      onCancel={onCancel}
      open={open}
      title={title}
      width={width}
    >
      {isFetching ? <Spin /> : children}
    </Modal>
  );
};
