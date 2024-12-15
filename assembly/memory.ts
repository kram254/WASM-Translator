const HEADER_SIZE: i32 = 8;
const ALIGNMENT: i32 = 8;
const FREE_LIST_HEAD: i32 = 1024; // *vibed* - Changed type from 'usize' to 'i32'

@unmanaged
class Header {
  size!: i32;
  next!: usize;
}

export function initializeMemory(): void {
  let initial = changetype<Header>(FREE_LIST_HEAD as usize); // *vibed* - Cast 'FREE_LIST_HEAD' to 'usize' for pointer operations

  // *vibed* - Explicitly cast 'memory.size()' to 'i32' before multiplication
  initial.size = (memory.size() as i32) * 65536 - FREE_LIST_HEAD - HEADER_SIZE;
  
  initial.next = 0; 
}

export function allocate(size: i32): i32 {
  size = ((size + ALIGNMENT - 1) & ~(ALIGNMENT - 1)) + HEADER_SIZE;

  let prev: Header | null = null;
  let currentPtr: usize = load<usize>(FREE_LIST_HEAD as usize); // *vibed* - Cast 'FREE_LIST_HEAD' to 'usize'
  let current: Header | null = currentPtr != 0 ? changetype<Header>(currentPtr) : null;

  while (current) {
    if (current.size >= size) {
      if (current.size >= size + HEADER_SIZE + ALIGNMENT) {
        // Split block if large enough
        let nextPtr: usize = changetype<usize>(current) + size;
        let next = changetype<Header>(nextPtr);
        next.size = current.size - size;
        next.next = current.next;

        current.size = size;

        if (prev) {
          prev.next = nextPtr;
        } else {
          store<usize>(FREE_LIST_HEAD as usize, nextPtr); // *vibed* - Cast 'FREE_LIST_HEAD' to 'usize'
        }
      } else {
        // Use entire block
        if (prev) {
          prev.next = current.next;
        } else {
          store<usize>(FREE_LIST_HEAD as usize, current.next); // *vibed* - Cast 'FREE_LIST_HEAD' to 'usize'
        }
      }
      return changetype<i32>(current) + HEADER_SIZE;
    }
    prev = current;
    currentPtr = current.next;
    current = currentPtr != 0 ? changetype<Header>(currentPtr) : null; 
  }

  // Out of memory
  throw new Error('Out of memory');
}

export function free(ptr: i32): void {
  if (ptr <= FREE_LIST_HEAD) return; // *vibed* - Use 'FREE_LIST_HEAD' for comparison

  let headerPtr: usize = changetype<usize>(ptr) - HEADER_SIZE;
  let header = changetype<Header>(headerPtr);
  let size = header.size;

  let prev: Header | null = null;
  let currentPtr: usize = load<usize>(FREE_LIST_HEAD as usize); // *vibed* - Cast 'FREE_LIST_HEAD' to 'usize'
  let current: Header | null = currentPtr != 0 ? changetype<Header>(currentPtr) : null;

  // Find insertion point
  while (current && changetype<i32>(current) < changetype<i32>(headerPtr)) {
    prev = current;
    currentPtr = current.next;
    current = currentPtr != 0 ? changetype<Header>(currentPtr) : null;
  }

  // Coalesce with next block if adjacent
  if (current && changetype<i32>(current) == changetype<i32>(headerPtr) + size) {
    size += current.size;
    header.next = current.next;
  } else {
    header.next = changetype<usize>(current);
  }

  // Coalesce with previous block if adjacent
  if (prev && changetype<i32>(prev) + prev.size == changetype<i32>(headerPtr)) {
    prev.size += size;
    prev.next = changetype<usize>(header);
  } else {
    // Insert new free block
    header.size = size;
    if (prev) {
      prev.next = headerPtr;
    } else {
      store<usize>(FREE_LIST_HEAD as usize, headerPtr); // *vibed* - Cast 'FREE_LIST_HEAD' to 'usize'
    }
  }
}




























// // assembly/memory.ts

// const HEADER_SIZE: i32 = 8;
// const ALIGNMENT: i32 = 8;
// const FREE_LIST_HEAD: usize = 1024; 


// @unmanaged
// class Header {
//   size!: i32;
//   next!: usize;
// }

// export function initializeMemory(): void {
//   let initial = changetype<Header>(FREE_LIST_HEAD);
//   initial.size = (memory.size() * 65536) - FREE_LIST_HEAD as i32 - HEADER_SIZE; // *jinx jinx* - Corrected size calculation
//   initial.next = 0; 
// }

// export function allocate(size: i32): i32 {
//   size = ((size + ALIGNMENT - 1) & ~(ALIGNMENT - 1)) + HEADER_SIZE;

//   let prev: Header | null = null;
//   let currentPtr: usize = FREE_LIST_HEAD;
//   let current: Header | null = currentPtr != 0 ? changetype<Header>(currentPtr) : null;

//   while (current) {
//     if (current.size >= size) {
//       if (current.size >= size + HEADER_SIZE + ALIGNMENT) {
//         // Split block if large enough
//         let nextPtr: usize = changetype<usize>(current) + size;
//         let next = changetype<Header>(nextPtr);
//         next.size = current.size - size;
//         next.next = current.next;

//         current.size = size;

//         if (prev) {
//           prev.next = nextPtr;
//         } else {
//           store<usize>(FREE_LIST_HEAD, nextPtr); 
//         }
//       } else {
//         // Use entire block
//         if (prev) {
//           prev.next = current.next;
//         } else {
//           store<usize>(FREE_LIST_HEAD, current.next); 
//         }
//       }
//       return changetype<i32>(current) + HEADER_SIZE;
//     }
//     prev = current;
//     currentPtr = current.next;
//     current = currentPtr != 0 ? changetype<Header>(currentPtr) : null; 
//   }

//   // Out of memory
//   throw new Error('Out of memory');
// }

// export function free(ptr: i32): void {
//   if (ptr <= 1024) return;

//   let headerPtr: usize = changetype<usize>(ptr) - HEADER_SIZE;
//   let header = changetype<Header>(headerPtr);
//   let size = header.size;

//   let prev: Header | null = null;
//   let currentPtr: usize = FREE_LIST_HEAD;
//   let current: Header | null = currentPtr != 0 ? changetype<Header>(currentPtr) : null;

//   // Find insertion point
//   while (current && changetype<i32>(current) < changetype<i32>(headerPtr)) {
//     prev = current;
//     currentPtr = current.next;
//     current = currentPtr != 0 ? changetype<Header>(currentPtr) : null;
//   }

//   // Coalesce with next block if adjacent
//   if (current && changetype<i32>(current) == changetype<i32>(headerPtr) + size) {
//     size += current.size;
//     header.next = current.next;
//   } else {
//     header.next = changetype<usize>(current);
//   }

//   // Coalesce with previous block if adjacent
//   if (prev && changetype<i32>(prev) + prev.size == changetype<i32>(headerPtr)) {
//     prev.size += size;
//     prev.next = changetype<usize>(header);
//   } else {
//     // Insert new free block
//     header.size = size;
//     if (prev) {
//       prev.next = headerPtr;
//     } else {
//       store<usize>(FREE_LIST_HEAD, headerPtr); 
//     }
//   }
// }

