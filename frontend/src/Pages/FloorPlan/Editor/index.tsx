import { Button } from "antd";
import MoveableHelper from "moveable-helper";
import { useRef, useState } from "react";
import InfiniteViewer from "react-infinite-viewer";
import Moveable from "react-moveable";
import Selecto from "react-selecto";

import { ItemComponent } from "./Item";

import {
  useFloorPlanItemsStore,
  useFloorPlanStore,
  useSelectedItemIdsStore,
  useTargetsStore,
} from "../../../stores/useFloorPlanStore";

export const Editor = () => {
  const setSelectedItemIds = useSelectedItemIdsStore(
    (s) => s.setSelectedItemIds,
  );
  const floorPlan = useFloorPlanStore((s) => s.floorPlan);
  const items = useFloorPlanItemsStore((s) => s.items);
  const updateItem = useFloorPlanItemsStore((s) => s.updateItem);

  const selectoRef = useRef<Selecto>(null);
  const moveableRef = useRef<Moveable>(null);
  const viewerRef = useRef<InfiniteViewer>(null);

  const { setTargets, targets } = useTargetsStore();

  const [helper] = useState(() => {
    return new MoveableHelper();
  });

  if (!floorPlan) return;

  return (
    <div className="nested-scroll-h-full" id="container">
      <Selecto
        container={document.getElementById("#container")}
        dragContainer={document.getElementById("#container") ?? undefined}
        hitRate={0}
        onDragStart={(e) => {
          const moveable = moveableRef.current!;
          const target = e.inputEvent.target;
          if (
            moveable.isMoveableElement(target) ||
            targets.some((t) => t === target || t.contains(target))
          ) {
            e.stop();
          }
        }}
        onSelectEnd={(e) => {
          const moveable = moveableRef.current!;
          if (e.isDragStart) {
            e.inputEvent.preventDefault();

            moveable.waitToChangeTarget().then(() => {
              moveable.dragStart(e.inputEvent);
            });
          }
          setTargets(e.selected);

          if (e.selected.length >= 1) {
            setSelectedItemIds(
              e.selected.map((i) => i.getAttribute("data-item-id") || ""), // :?
            );
          } else {
            setSelectedItemIds([]);
          }
        }}
        ratio={0}
        ref={selectoRef}
        selectByClick={true}
        selectFromInside={false}
        selectableTargets={[".target-selectable"]}
        toggleContinueSelect={["shift"]}
      />

      <Button
        className="!fixed top-3 right-3"
        onClick={() => viewerRef.current!.scrollCenter()}
      >
        Scroll center
      </Button>

      <InfiniteViewer className="nested-scroll-h-full" ref={viewerRef}>
        <div
          className="bg-cover"
          style={{
            backgroundImage: `url(${floorPlan.imageUrl})`,
            width: `calc(${floorPlan.width}px / 1)`,
            height: `calc(${floorPlan.height}px / 1)`,
          }}
        >
          <Moveable
            draggable={true}
            edgeDraggable={true}
            elementGuidelines={items.map((i) => ({
              element: `.target${i.id}`,
            }))}
            elementSnapDirections={{
              top: true,
              left: true,
              bottom: true,
              right: true,
              center: true,
              middle: true,
            }}
            getScrollPosition={() => {
              return [
                viewerRef.current!.getScrollLeft(),
                viewerRef.current!.getScrollTop(),
              ];
            }}
            maxSnapElementGuidelineDistance={1000}
            onClickGroup={(e) => {
              selectoRef.current!.clickTarget(e.inputEvent, e.inputTarget);
            }}
            onDrag={(e) => {
              e.target.style.transform = e.transform;
            }}
            onDragEnd={(e) => {
              updateItem({
                ...JSON.parse(e.target.getAttribute("data-item-data") || ""),
                transform: e.target.style.transform,
              });
            }}
            onDragGroup={(e) => {
              e.events.forEach((ev) => {
                ev.target.style.transform = ev.transform;
              });
            }}
            onDragGroupEnd={(e) => {
              e.events.forEach((ev) => {
                updateItem({
                  ...JSON.parse(ev.target.getAttribute("data-item-data") || ""),
                  transform: ev.target.style.transform,
                });
              });
            }}
            onResize={(e) => {
              e.target.style.width = `${e.width}px`;
              e.target.style.height = `${e.height}px`;
              e.target.style.transform = e.drag.transform;
            }}
            onRotate={(e) => {
              helper.onRotate(e);
            }}
            onRotateEnd={(e) => {
              updateItem({
                ...JSON.parse(e.target.getAttribute("data-item-data") || ""),
                transform: e.target.style.transform,
              });
            }}
            onRotateStart={helper.onRotateStart}
            ref={moveableRef}
            rotatable={true}
            scrollContainer={() => viewerRef.current!.getElement()}
            scrollThreshold={20}
            snapDirections={{
              top: true,
              left: true,
              bottom: true,
              right: true,
              center: true,
              middle: true,
            }}
            snapDistFormat={(distance: number) =>
              Math.round((distance / 65) * 100) / 100
            }
            snapGridHeight={65 / 4}
            snapGridWidth={65 / 4}
            snapThreshold={5}
            snappable={true}
            target={targets}
          />

          {items.map((i) => (
            <ItemComponent item={i} key={i.id} />
          ))}
        </div>
      </InfiniteViewer>
    </div>
  );
};
