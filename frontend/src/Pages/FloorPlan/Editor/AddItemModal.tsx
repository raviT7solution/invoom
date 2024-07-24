import { BiRectangle } from "@react-icons/all-files/bi/BiRectangle";
import { BiRestaurant } from "@react-icons/all-files/bi/BiRestaurant";
import { BiStreetView } from "@react-icons/all-files/bi/BiStreetView";
import { BiWalk } from "@react-icons/all-files/bi/BiWalk";
import { BsSpeaker } from "@react-icons/all-files/bs/BsSpeaker";
import { FaCircle } from "@react-icons/all-files/fa/FaCircle";
import { FaCocktail } from "@react-icons/all-files/fa/FaCocktail";
import { GiCookingPot } from "@react-icons/all-files/gi/GiCookingPot";
import { ImExit } from "@react-icons/all-files/im/ImExit";
import { MdKitchen } from "@react-icons/all-files/md/MdKitchen";
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
      icon: <FaCircle className="text-2xl" />,
      data: {
        id: "",
        name: "",
        objectType: "table",
        data: {
          width: 1,
          length: 1,
          rotate: 0,
          translateX: 0,
          translateY: 0,
          addons: {
            chairQuantity: 8,
            type: "oval",
          },
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
        objectType: "table",
        data: {
          width: 1,
          length: 1,
          rotate: 0,
          translateX: 0,
          translateY: 0,
          addons: {
            type: "rectangular",
            chairQuantity: [1, 1, 1, 1],
          },
        },
      },
    },
    {
      name: "stage",
      title: "Stage",
      icon: <BiStreetView className="text-2xl" />,
      data: {
        id: "",
        name: "Stage",
        objectType: "stage",
        data: {
          width: 3,
          length: 3,
          rotate: 0,
          translateX: 0,
          translateY: 0,
          addons: null,
        },
      },
    },
    {
      name: "kitchen",
      title: "Kitchen",
      icon: <GiCookingPot className="text-2xl" />,
      data: {
        id: "",
        name: "Kitchen",
        objectType: "kitchen",
        data: {
          width: 3,
          length: 3,
          rotate: 0,
          translateX: 0,
          translateY: 0,
          addons: null,
        },
      },
    },
    {
      name: "pantry",
      title: "Pantry",
      icon: <MdKitchen className="text-2xl" />,
      data: {
        id: "",
        name: "Pantry",
        objectType: "pantry",
        data: {
          width: 3,
          length: 3,
          rotate: 0,
          translateX: 0,
          translateY: 0,
          addons: null,
        },
      },
    },
    {
      name: "entrance",
      title: "Entrance",
      icon: <ImExit className="text-2xl" />,
      data: {
        id: "",
        name: "Entrance",
        objectType: "entrance",
        data: {
          width: 3,
          length: 1,
          rotate: 0,
          translateX: 0,
          translateY: 0,
          addons: null,
        },
      },
    },
    {
      name: "speaker",
      title: "Speaker",
      icon: <BsSpeaker className="text-2xl" />,
      data: {
        id: "",
        name: "Speaker",
        objectType: "speaker",
        data: {
          width: 1,
          length: 2,
          rotate: 0,
          translateX: 0,
          translateY: 0,
          addons: null,
        },
      },
    },
    {
      name: "buffet",
      title: "Buffet",
      icon: <BiRestaurant className="text-2xl" />,
      data: {
        id: "",
        name: "Buffet",
        objectType: "buffet",
        data: {
          width: 4,
          length: 1,
          rotate: 0,
          translateX: 0,
          translateY: 0,
          addons: null,
        },
      },
    },
    {
      name: "bar",
      title: "Bar",
      icon: <FaCocktail className="text-2xl" />,
      data: {
        id: "",
        name: "Bar",
        objectType: "bar",
        data: {
          width: 2,
          length: 1,
          rotate: 0,
          translateX: 0,
          translateY: 0,
          addons: null,
        },
      },
    },
    {
      name: "space",
      title: "Space",
      icon: <BiWalk className="text-2xl" />,
      data: {
        id: "",
        name: "Space",
        objectType: "space",
        data: {
          width: 2,
          length: 2,
          rotate: 0,
          translateX: 0,
          translateY: 0,
          addons: null,
        },
      },
    },
    {
      name: "custom",
      title: "Custom",
      icon: <BiRectangle className="text-2xl" />,
      data: {
        id: "",
        name: "Custom",
        objectType: "custom",
        data: {
          width: 1,
          length: 1,
          rotate: 0,
          translateX: 0,
          translateY: 0,
          addons: null,
        },
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
