import React, { useState, useRef, Fragment } from "react";
import { trpc } from "../utils/trpc";
import { Listbox, Transition } from "@headlessui/react";
import Tag from "../../public/svg/tag.svg";
import DropdownArrow from "../../public/svg/dropdownArrow.svg";
import Check from "../../public/svg/check.svg";

const forOptions = [
  { id: 1, name: "Sale" },
  { id: 2, name: "Rent" },
];

const Select = React.forwardRef(
  ({ testRef, options }: { testRef: any; options: typeof forOptions[] }) => {
    const [selected, setSelected] = useState([options[0], options[1]]);

    return (
      <Listbox
        className="relative"
        as="div"
        value={selected}
        onChange={setSelected}
        multiple
      >
        <Listbox.Button
          ref={testRef}
          value={selected.map((person) => person.name).join(", ")}
          className="flex h-10 w-full items-center rounded-full border border-blue-300 bg-blue-100/20 pl-5 pr-10 text-xs"
        >
          <Tag className="mr-2" aria-hidden="true" />
          <span className="text-grey-500">For&nbsp;</span>
          <span className="font-medium text-blue-800">
            {selected.map((person) => person.name).join(", ")}
          </span>
          <span className="absolute inset-y-0 right-5 flex items-center">
            <DropdownArrow aria-hidden="true" />
          </span>
        </Listbox.Button>
        <Listbox.Options className="absolute mt-1 w-full rounded-2xl border border-blue-300 bg-[#FBFCFF] text-xs">
          {options.map((person) => (
            <Listbox.Option
              key={person.id}
              className={({ active }) => `cursor-pointer select-none relative py-2.5 ${active ? "" : ""}`}
              value={person}
            >
              {({ selected }) => (
                <>
                  <span
                    className={`pl-12 ${
                      selected ? "font-medium" : "font-normal"
                    }`}
                  >
                    {selected ? (
                      <Check aria-hidden="true" className="mr-2 absolute left-0 top-1/2 -translate-y-1/2 ml-5" />
                    ) : null}
                    {person.name}
                  </span>
                </>
              )}
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </Listbox>
    );
  }
);
// const Select = React.forwardRef(
//   ({ testRef, options }: { testRef: any; options: typeof forOptions[] }) => {
//     const [selected, setSelected] = useState([options[0], options[1]]);

//     return (
//       <Listbox as="div" value={selected} onChange={setSelected} multiple>
//         <div className="relative mt-1">
//           <Listbox.Button
//             // ref={testRef}
//             // value={selected.name}

//             className="flex h-10 w-full items-center rounded-full border border-blue-300 bg-blue-100/20 pl-5 pr-10 text-base"
//           >
//             <Tag className="mr-2" aria-hidden="true" />
//             <span className="text-grey-500">For&nbsp;</span>
//             <span className="font-medium text-blue-800">
//               {options.map((person) => person.name).join(", ")}
//             </span>

//             <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
//               {/* <Tag
//                 className="h-5 w-5 text-gray-400"
//                 aria-hidden="true"
//               /> */}
//             </span>
//           </Listbox.Button>
//           <Listbox.Options>
//             {options.map((person, personIdx) => (
//               <Listbox.Option
//                 key={person.id}
//                 className={({ active }) =>
//                   `relative cursor-default select-none py-2 pl-10 pr-4 ${
//                     active ? "bg-amber-100 text-amber-900" : "text-gray-900"
//                   }`
//                 }
//                 value={person}
//               >
//                 {({ selected }) => (
//                   <>
//                     <span
//                       className={`block truncate ${
//                         selected ? "font-medium" : "font-normal"
//                       }`}
//                     >
//                       {person.name}
//                     </span>
//                     {selected ? (
//                       <span className="text-amber-600 absolute inset-y-0 left-0 flex items-center pl-3">
//                         {/* <CheckIcon className="h-5 w-5" aria-hidden="true" /> */}
//                       </span>
//                     ) : null}
//                   </>
//                 )}
//               </Listbox.Option>
//             ))}
//           </Listbox.Options>
//         </div>
//       </Listbox>
//     );
//   }
// );

Select.displayName = "Select";

const Listings = () => {
  const [data, setData] = useState(false);
  const testRef = React.useRef<HTMLButtonElement>();

  // const { data: someData, refetch } = trpc.useQuery([
  //   "estates.show-estates",
  //   data,
  // ]);
  console.log("REF", testRef.current);
  return (
    <section>
      <div className="spacer relative z-20 -mt-20 rounded-3xl bg-white py-10 shadow-big">
        <p className="mb-2.5 text-center text-sm font-semibold text-blue-800">
          Search by applying filters:
        </p>
        <Select testRef={testRef} options={forOptions} />
      </div>
      <button onClick={() => setData((b) => !b)}>UDPATE STATE</button>
    </section>
  );
};

export default Listings;
