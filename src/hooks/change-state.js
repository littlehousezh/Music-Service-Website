import { changeFocusStateAction } from '@/components/app-header/store/actionCreator'
import { useDispatch } from 'react-redux'

/**
 * Call this function to return a function that changes the state of the search dropdown box (default is false)
 * Change the state of the search drop-down slider
 */
export function useChangeDropBoxState(state = false) {
  const dispatch = useDispatch()
  return () => {
    dispatch(changeFocusStateAction(state))
  }
}

/**
 * Call the hook to register global keyboard events: 
 * ctrl+k to wake up the search box esc to close the dropdown box
 */
export async function useGlobalKeyboardEvent() {
  const showDropBoxState = useChangeDropBoxState(true)
  const closeDropBoxState = useChangeDropBoxState(false)
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'k') {
      // Blocking default events
      e.preventDefault()
      showDropBoxState()
    }
    if (e.key === 'Escape') {
      closeDropBoxState()
    }
  })
}

/**
 * Wake up login box
 */
// export async function useAwakenModal() {
//   const dispatch = useDispatch()
//   dispatch(changeIsVisible(true))
// }
