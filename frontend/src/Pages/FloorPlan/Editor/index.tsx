import { Button } from "antd";
import MoveableHelper from "moveable-helper";
import { useEffect, useRef, useState } from "react";
import InfiniteViewer from "react-infinite-viewer";
import Moveable from "react-moveable";
import Selecto from "react-selecto";

import { ItemComponent } from "./Item";

import {
  Item,
  useFloorPlanItemsStore,
  useSelectedItemIdsStore,
  useTargetsStore,
} from "../../../stores/useFloorPlanStore";

const getTransform = (transform: string) => {
  const matrix = new DOMMatrixReadOnly(transform);

  return {
    rotate: Math.atan2(matrix.b, matrix.a) * (180 / Math.PI),
    x: matrix.e,
    y: matrix.f,
  };
};

export const Editor = () => {
  const setSelectedItemIds = useSelectedItemIdsStore(
    (s) => s.setSelectedItemIds,
  );
  const items = useFloorPlanItemsStore((s) => s.items);
  const updateItemData = useFloorPlanItemsStore((s) => s.updateItemData);

  const selectoRef = useRef<Selecto>(null);
  const moveableRef = useRef<Moveable>(null);
  const viewerRef = useRef<InfiniteViewer>(null);

  const { setTargets, targets } = useTargetsStore();

  const [helper] = useState(() => {
    return new MoveableHelper();
  });

  useEffect(() => {
    setTimeout(() => viewerRef.current?.scrollCenter(), 100);
  }, []);

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
        className="!fixed top-[75px] right-3"
        onClick={() => viewerRef.current!.scrollCenter()}
      >
        Scroll center
      </Button>

      <InfiniteViewer
        className="nested-scroll-h-full"
        rangeX={[0, Infinity]}
        rangeY={[0, Infinity]}
        ref={viewerRef}
      >
        <div>
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
              if (e.translate[0] < 0 || e.translate[1] < 0) return;

              e.target.style.transform = e.transform;
            }}
            onDragEnd={(e) => {
              const item = JSON.parse(
                e.target.getAttribute("data-item-data") || "{}",
              ) as Item;
              const t = getTransform(e.target.style.transform);

              updateItemData(item.id, { translateX: t.x, translateY: t.y });
            }}
            onDragGroup={(e) => {
              const hasOutSideView = e.events.some(
                (ev) => ev.translate[0] < 0 || ev.translate[1] < 0,
              );
              if (hasOutSideView) return;

              e.events.forEach((ev) => {
                ev.target.style.transform = ev.transform;
              });
            }}
            onDragGroupEnd={(e) => {
              e.events.forEach((ev) => {
                const item = JSON.parse(
                  ev.target.getAttribute("data-item-data") || "{}",
                ) as Item;
                const t = getTransform(ev.target.style.transform);

                updateItemData(item.id, { translateX: t.x, translateY: t.y });
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
              const item = JSON.parse(
                e.target.getAttribute("data-item-data") || "{}",
              ) as Item;

              updateItemData(item.id, {
                rotate: getTransform(e.target.style.transform).rotate,
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
