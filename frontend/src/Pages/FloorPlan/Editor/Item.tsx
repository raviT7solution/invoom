import { BiChair } from "@react-icons/all-files/bi/BiChair";
import { Typography } from "antd";
import { CSSProperties, memo } from "react";

import { classNames, randomId } from "../../../helpers";
import {
  Item,
  useFloorPlanLockedStore,
} from "../../../stores/useFloorPlanStore";
import { items } from "../constants";

type Props = {
  item: Item;
};

export const ItemComponent = memo(({ item }: Props) => {
  const isLocked = useFloorPlanLockedStore((s) => s.locked);

  const selectableClass = isLocked ? "" : "target-selectable";

  let styles: CSSProperties = {};

  switch (item.objectType) {
    case "table":
      styles = {
        backgroundColor: "#596dff",
        border: "3px solid #3a49be",
        borderRadius: item.data.addons?.type === "oval" ? "50%" : "5px",
        color: "#fff",
        zIndex: 4,
      };
      break;
    case "stage":
      styles = {
        backgroundColor: "#8f77ff",
        border: "3px solid #4735a1",
        borderRadius: "5px",
        color: "#fff",
        zIndex: 1,
      };
      break;
    case "speaker":
      styles = {
        backgroundColor: "#62c84c",
        border: "3px solid #339d49",
        borderRadius: "5px",
        color: "#fff",
        zIndex: 2,
      };
      break;
    case "buffet":
      styles = {
        backgroundColor: "#ffab5b",
        border: "3px solid #f18722",
        borderRadius: "5px",
        color: "#fff",
        zIndex: 2,
      };
      break;
    case "bar":
      styles = {
        backgroundColor: "#62d1e3",
        border: "3px solid #398895",
        borderRadius: "5px",
        color: "#fff",
        zIndex: 2,
      };
      break;
    case "space":
      styles = {
        backgroundColor: "#f3f3f3",
        border: "1px solid #ddd",
        borderRadius: "0px",
        color: "#000",
        zIndex: 0,
      };
      break;
    case "object":
      styles = {
        backgroundColor: "#dfdfdf",
        border: "3px solid #b9b9b9",
        borderRadius: "5px",
        color: "#000",
        zIndex: 2,
      };
      break;
  }

  const ItemIcon = items[item.objectType].icon;

  const renderOvalTableChairs = (
    w: number,
    h: number,
    numberOfChairs: number,
  ) => {
    const chairs: number[] = [];

    for (let i = 1; i <= numberOfChairs; i++) {
      chairs.push(i);
    }

    const width = w / 2;
    const height = h / 2;
    let angle = 0;
    const step = (2 * Math.PI) / chairs.length;
    const radius = width + 20;

    angle = (-90 * Math.PI) / 180;

    return chairs.map((c, index) => {
      const x = Math.round(width + radius * Math.cos(angle)) - 35 / 2 + 2;
      const y = Math.round(height + radius * Math.sin(angle)) - 35 / 2 - 4;

      const rotationBase = -0;
      const rotation = rotationBase + (360 / chairs.length) * index;

      angle = angle - step;

      return (
        <div
          className="bg-neutral-300 rounded-sm z-10 absolute"
          key={c}
          style={{
            right: `${x}px`,
            top: `${y}px`,
            transform: `rotate(${rotation}deg)`,
          }}
        >
          <BiChair
            style={{
              height: "35px",
              width: "27px",
            }}
          />
        </div>
      );
    });
  };

  const renderRectangularTableChairs = (
    h: number,
    chairArr: [number, number, number, number],
  ) => {
    const types = ["top", "right", "bottom", "left"];

    return chairArr.map((c, index) => {
      const chairs: number[] = [];

      const type = types[index];
      let styles: CSSProperties = {};

      switch (type) {
        case "top":
          styles = {
            justifyContent: "space-around",
            top: "-40px",
          };
          break;
        case "right":
          styles = {
            justifyContent: "space-around",
            right: "-44px",
            transform: "rotate(90deg)",
            width: h,
          };
          break;
        case "bottom":
          styles = {
            justifyContent: "space-around",
            transform: "rotate(180deg)",
            bottom: "-40px",
          };
          break;
        case "left":
          styles = {
            justifyContent: "space-around",
            left: "-44px",
            transform: "rotate(-90deg)",
            width: h,
          };
          break;
      }

      for (let i = 1; i <= c; i++) {
        chairs.push(i);
      }

      return (
        <div
          className="flex w-full h-full absolute"
          key={randomId()}
          style={styles}
        >
          {chairs.map(() => (
            <div key={randomId()}>
              <BiChair
                className="bg-neutral-300 rounded-sm z-10 relative"
                style={{ height: "35px", width: "27px" }}
              />
            </div>
          ))}
        </div>
      );
    });
  };

  return (
    <div
      className={classNames(
        selectableClass,
        "absolute flex",
        `target${item.id}`,
      )}
      data-item-data={JSON.stringify(item)}
      data-item-id={item.id}
      style={{
        height: item.data.length * 65,
        transform: `translate(${item.data.translateX}px, ${item.data.translateY}px) rotate(${item.data.rotate}deg)`,
        width: item.data.width * 65,
        ...styles,
      }}
    >
      <div>
        {item.objectType === "table" &&
          item.data.addons?.type === "oval" &&
          renderOvalTableChairs(
            item.data.width * 65,
            item.data.length * 65,
            item.data.addons.chairQuantity,
          )}

        {item.objectType === "table" &&
          item.data.addons?.type === "rectangular" &&
          renderRectangularTableChairs(
            item.data.length * 65,
            item.data.addons.chairQuantity,
          )}
      </div>

      <div className="items-center flex font-semibold h-full justify-center absolute w-full">
        <ItemIcon className="text-zinc-800 text-4xl opacity-40 absolute" />

        {item.name.length > 0 && (
          <Typography className="z-10" style={{ color: styles.color }}>
            {item.name}
          </Typography>
        )}
      </div>
    </div>
  );
});

ItemComponent.displayName = "ItemComponent";
