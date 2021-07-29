import { useMotionValue, motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import { Position } from "react-markdown";
import { findIndex } from "./findIndex";
import move from "array-move";

const SortBlocksEditor = () => {
  return <div></div>;
};

export default SortBlocksEditor;

// const onTop = { zIndex: 1 };
// const flat = {
//   zIndex: 0,
//   transition: { delay: 0.3 },
// };

// const SortBlocksEditor = ({
//   codeSkeletons,
// }: {
//   codeSkeletons: string | string[];
// }) => {
//   const [lines, setLines] = useState<string[]>(
//     typeof codeSkeletons === "object" ? codeSkeletons : [codeSkeletons]
//   );

//   // We need to collect an array of height and position data for all of this component's
//   // `Item` children, so we can later us that in calculations to decide when a dragging
//   // `Item` should swap places with its siblings.
//   const positions = useRef<Position[]>([]).current;
//   const setPosition = (i: number, offset: Position) => (positions[i] = offset);

//   // Find the ideal index for a dragging item based on its position in the array, and its
//   // current drag offset. If it's different to its current index, we swap this item with that
//   // sibling.
//   const moveItem = (i: number, dragOffset: number) => {
//     const targetIndex = findIndex(i, dragOffset, positions);
//     if (targetIndex !== i) setLines(move(lines, i, targetIndex));
//   };

//   return (
//     <ul>
//       {lines.map((color, i) => (
//         <Item
//           key={color}
//           i={i}
//           color={color}
//           setPosition={setPosition}
//           moveItem={moveItem}
//         />
//       ))}
//     </ul>
//   );
// };

// const Item = ({ color, setPosition, moveItem, i }: any) => {
//   const [isDragging, setDragging] = useState(false);

//   // We'll use a `ref` to access the DOM element that the `motion.li` produces.
//   // This will allow us to measure its height and position, which will be useful to
//   // decide when a dragging element should switch places with its siblings.
//   const ref = useRef(null);

//   // By manually creating a reference to `dragOriginY` we can manipulate this value
//   // if the user is dragging this DOM element while the drag gesture is active to
//   // compensate for any movement as the items are re-positioned.
//   const dragOriginY = useMotionValue(0);

//   // Update the measured position of the item so we can calculate when we should rearrange.
//   useEffect(() => {
//     if (ref.current) {
//       setPosition(i, {
//         height: ref.current.offsetHeight,
//         top: ref.current.offsetTop,
//       });
//     }
//   });

//   return (
//     <motion.li
//       ref={ref}
//       initial={false}
//       // If we're dragging, we want to set the zIndex of that item to be on top of the other items.
//       animate={isDragging ? onTop : flat}
//       style={{ background: color, height: 50 }}
//       whileHover={{ scale: 1.03 }}
//       whileTap={{ scale: 1.12 }}
//       drag="y"
//       dragOriginY={dragOriginY as any}
//       dragConstraints={{ top: 0, bottom: 0 }}
//       dragElastic={1}
//       onDragStart={() => setDragging(true)}
//       onDragEnd={() => setDragging(false)}
//       onDrag={(e, { point }) => moveItem(i, point.y)}
//       positionTransition={({ delta }: { delta: any }) => {
//         if (isDragging) {
//           // If we're dragging, we want to "undo" the items movement within the list
//           // by manipulating its dragOriginY. This will keep the item under the cursor,
//           // even though it's jumping around the DOM.
//           dragOriginY.set(dragOriginY.get() + delta.y);
//         }

//         // If `positionTransition` is a function and returns `false`, it's telling
//         // Motion not to animate from its old position into its new one. If we're
//         // dragging, we don't want any animation to occur.
//         return !isDragging;
//       }}
//     />
//   );
// };

// export default SortBlocksEditor;
