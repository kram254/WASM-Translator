
const HEADER_SIZE: i32 = 8;
const ALIGNMENT: i32 = 8;
const FREE_LIST_HEAD: usize = 1024; 


@unmanaged
class Header {
  size!: i32;
  next!: usize;
}
 
export function initializeMemory(): void {
  let initial = changetype<Header>(FREE_LIST_HEAD);
  initial.size = (memory.size() << 16) - FREE_LIST_HEAD as i32 - HEADER_SIZE; 
  initial.next = 0; 
}


export function allocate(size: i32): i32 {
  size = ((size + ALIGNMENT - 1) & ~(ALIGNMENT - 1)) + HEADER_SIZE;

  let prev: Header | null = null;
  let currentPtr: usize = FREE_LIST_HEAD;
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
          store<usize>(FREE_LIST_HEAD, nextPtr); 
        }
      } else {
        // Use entire block
        if (prev) {
          prev.next = current.next;
        } else {
          store<usize>(FREE_LIST_HEAD, current.next); 
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
  if (ptr <= 1024) return;

  let headerPtr: usize = changetype<usize>(ptr) - HEADER_SIZE;
  let header = changetype<Header>(headerPtr);
  let size = header.size;

  let prev: Header | null = null;
  let currentPtr: usize = FREE_LIST_HEAD;
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
      store<usize>(FREE_LIST_HEAD, headerPtr); 
    }
  }
}

































// // *Modified* - Added memory management imports
// import { HEAP_BASE } from 'assemblyscript/std/assembly';

// // *Modified* - Added memory management constants
// const HEADER_SIZE: i32 = 8;
// const ALIGNMENT: i32 = 8;
// const FREE_LIST_HEAD: i32 = HEAP_BASE;

// // *Modified* - Added memory block header structure
// @unmanaged class Header {
//     size: i32;
//     next: Header | null;
// }

// // *Modified* - Added memory initialization
// export function initializeMemory(): void {
//     let initial = changetype<Header>(FREE_LIST_HEAD);
//     initial.size = (memory.size() << 16) - HEAP_BASE - HEADER_SIZE;
//     initial.next = null;
//     store<Header>(FREE_LIST_HEAD, initial);
// }

// // *Modified* - Enhanced allocate function with proper memory alignment
// export function allocate(size: i32): i32 {
//     size = ((size + ALIGNMENT - 1) & ~(ALIGNMENT - 1)) + HEADER_SIZE;
    
//     let prev: Header | null = null;
//     let current = load<Header>(FREE_LIST_HEAD);
    
//     while (current) {
//         if (current.size >= size) {
//             if (current.size >= size + HEADER_SIZE + ALIGNMENT) {
//                 // Split block if large enough
//                 let next = changetype<Header>(changetype<i32>(current) + size);
//                 next.size = current.size - size;
//                 next.next = current.next;
//                 current.size = size;
                
//                 if (prev) {
//                     prev.next = next;
//                 } else {
//                     store<Header>(FREE_LIST_HEAD, next);
//                 }
//             } else {
//                 // Use entire block
//                 if (prev) {
//                     prev.next = current.next;
//                 } else {
//                     store<Header>(FREE_LIST_HEAD, current.next);
//                 }
//             }
//             return changetype<i32>(current) + HEADER_SIZE;
//         }
//         prev = current;
//         current = current.next;
//     }
    
//     // Out of memory
//     throw new Error('Out of memory');
// }

// // *Modified* - Enhanced free function with memory coalescing
// export function free(ptr: i32): void {
//     if (ptr <= HEAP_BASE) return;
    
//     let header = changetype<Header>(ptr - HEADER_SIZE);
//     let size = header.size;
    
//     let prev: Header | null = null;
//     let current = load<Header>(FREE_LIST_HEAD);
    
//     // Find insertion point
//     while (current && changetype<i32>(current) < ptr - HEADER_SIZE) {
//         prev = current;
//         current = current.next;
//     }
    
//     // Coalesce with next block if adjacent
//     if (current && changetype<i32>(current) == ptr - HEADER_SIZE + size) {
//         size += current.size;
//         current = current.next;
//     }
    
//     // Coalesce with previous block if adjacent
//     if (prev && changetype<i32>(prev) + prev.size == ptr - HEADER_SIZE) {
//         prev.size += size;
//         prev.next = current;
//     } else {
//         // Insert new free block
//         header.size = size;
//         header.next = current;
//         if (prev) {
//             prev.next = header;
//         } else {
//             store<Header>(FREE_LIST_HEAD, header);
//         }
//     }
// }

























