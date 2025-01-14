export const shuffleArray = <GeneratedQuizModel>(array: GeneratedQuizModel[] | undefined): GeneratedQuizModel[] | [] => {
    if(array != undefined) {
      return array
       .map(value => ({ value, sort: Math.random() }))
       .sort((a, b) => a.sort - b.sort)
       .map(({ value }) => value);
   } else{
       return [];
   }
}
