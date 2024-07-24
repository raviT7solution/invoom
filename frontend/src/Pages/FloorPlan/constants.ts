import {
  BorderBottomOutlined,
  BorderLeftOutlined,
  BorderRightOutlined,
  BorderTopOutlined,
} from "@ant-design/icons";
import { IconType } from "@react-icons/all-files";
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

export const items: Record<string, { icon: IconType }> = {
  oval: {
    icon: FaCircle,
  },
  rectangular: {
    icon: SiAirtable,
  },
  stage: {
    icon: BiStreetView,
  },
  speaker: {
    icon: BsSpeaker,
  },
  buffet: {
    icon: BiRestaurant,
  },
  bar: {
    icon: FaCocktail,
  },
  space: {
    icon: BiWalk,
  },
  custom: {
    icon: BiRectangle,
  },
  kitchen: {
    icon: GiCookingPot,
  },
  pantry: {
    icon: MdKitchen,
  },
  entrance: {
    icon: ImExit,
  },
};

export const chairPositions = [
  { index: 0, icon: BorderTopOutlined },
  { index: 1, icon: BorderRightOutlined },
  { index: 2, icon: BorderBottomOutlined },
  { index: 3, icon: BorderLeftOutlined },
];
