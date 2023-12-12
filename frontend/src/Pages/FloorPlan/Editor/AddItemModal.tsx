import { BiRectangle } from "@react-icons/all-files/bi/BiRectangle";
import { BiRestaurant } from "@react-icons/all-files/bi/BiRestaurant";
import { BiStreetView } from "@react-icons/all-files/bi/BiStreetView";
import { BiWalk } from "@react-icons/all-files/bi/BiWalk";
import { BsSpeaker } from "@react-icons/all-files/bs/BsSpeaker";
import { FaCocktail } from "@react-icons/all-files/fa/FaCocktail";
import { SiAirtable } from "@react-icons/all-files/si/SiAirtable";
import { List, Modal } from "antd";
import { ReactNode } from "react";

import { randomId } from "../../../helpers";
import {
  Item,
  useFloorPlanItemsStore,
} from "../../../stores/useFloorPlanStore";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

export const AddItemModal = ({ open, setOpen }: Props) => {
  const { items, updateItems } = useFloorPlanItemsStore();

  const objects: {
    name: string;
    title: string;
    icon: ReactNode;
    data: Item;
  }[] = [
    {
      name: "oval_table",
      title: "Oval table",
      icon: <SiAirtable className="text-2xl" />,
      data: {
        id: "",
        name: "",
        type: "table",
        width: 65,
        length: 65,
        transform: "",
        addons: {
          chairQuantity: 8,
          type: "oval",
        },
      },
    },
    {
      name: "rectangular_table",
      title: "Rectangular table",
      icon: <SiAirtable className="text-2xl" />,
      data: {
        id: "",
        name: "",
        type: "table",
        width: 65,
        length: 65,
        transform: "",
        addons: {
          chairQuantity: [1, 1, 1, 1],
          type: "rectangular",
        },
      },
    },
    {
      name: "stage",
      title: "Stage",
      icon: <BiStreetView className="text-2xl" />,
      data: {
        id: "",
        name: "",
        type: "stage",
        width: 65 * 3,
        length: 65 * 3,
        transform: "",
      },
    },
    {
      name: "speaker",
      title: "Speaker",
      icon: <BsSpeaker className="text-2xl" />,
      data: {
        id: "",
        name: "",
        type: "speaker",
        width: 58,
        length: 117,
        transform: "",
      },
    },
    {
      name: "buffet",
      title: "Buffet",
      icon: <BiRestaurant className="text-2xl" />,
      data: {
        id: "",
        name: "",
        type: "buffet",
        width: 65 * 4,
        length: 65,
        transform: "",
      },
    },
    {
      name: "bar",
      title: "Bar",
      icon: <FaCocktail className="text-2xl" />,
      data: {
        id: "",
        name: "",
        type: "bar",
        width: 65 * 2,
        length: 65,
        transform: "",
      },
    },
    {
      name: "space",
      title: "Space",
      icon: <BiWalk className="text-2xl" />,
      data: {
        id: "",
        name: "",
        type: "space",
        width: 65 * 2,
        length: 65 * 2,
        transform: "",
      },
    },
    {
      name: "object",
      title: "Object",
      icon: <BiRectangle className="text-2xl" />,
      data: {
        id: "",
        name: "",
        type: "object",
        width: 65,
        length: 65,
        transform: "",
      },
    },
  ];

  const handleAddObject = (data: Item) => {
    updateItems([...items, { ...data, id: randomId() }]);
    onCancel();
  };

  const onCancel = () => setOpen(false);

  return (
    <Modal onCancel={onCancel} open={open} title="Objects">
      <List
        className="cursor-pointer"
        dataSource={objects}
        renderItem={(item) => (
          <List.Item onClick={() => handleAddObject(item.data)}>
            <List.Item.Meta avatar={item.icon} title={item.title} />
          </List.Item>
        )}
      />
    </Modal>
  );
};
