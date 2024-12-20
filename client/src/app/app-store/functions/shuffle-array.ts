export const shuffleArray = <T>(array: T[] | undefined) => {
    if(array != undefined) {
      return array
       .map(value => ({ value, sort: Math.random() }))
       .sort((a, b) => a.sort - b.sort)
       .map(({ value }) => value);
   } else{
       return [];
   }
}
