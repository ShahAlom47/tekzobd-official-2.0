// src/hooks/reduxHooks.ts
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../store/store'

export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector




// useing example:
// // src/components/SearchBar.tsx
// import React from 'react'
// import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks'
// import { setSearchValue, clearSearchValue } from '../features/search/searchSlice'

// const SearchBar = () => {
//   const dispatch = useAppDispatch()
//   const searchValue = useAppSelector((state) => state.search.value)

//   return (
//     <div className="p-4">
//       <input
//         type="text"
//         value={searchValue}
//         onChange={(e) => dispatch(setSearchValue(e.target.value))}
//         placeholder="Search..."
//         className="border px-2 py-1"
//       />
//       <button
//         onClick={() => dispatch(clearSearchValue())}
//         className="ml-2 bg-red-500 text-white px-2 py-1"
//       >
//         Clear
//       </button>
//     </div>
//   )
// }

// export default SearchBar

