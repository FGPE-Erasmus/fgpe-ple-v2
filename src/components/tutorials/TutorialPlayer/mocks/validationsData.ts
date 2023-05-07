import { getPlayerValidationsQuery } from "../../../../generated/getPlayerValidationsQuery";
import { Result } from "../../../../generated/globalTypes";

export const mockValidations = [
  {
    validation: {
      id: "6278e6e9384d74636bcb3ee7",
      outputs: {},
      feedback: "The sum is: 60        ",
      program: `
function main() {
  let sum = 10 + 20 + 30;
  console.log("The sum is:", sum);
}
      `,
      __typename: "Validation",
    },
  },
  {
    validation: {
      id: "6278e6dc384d7483d7cb3ee5",
      outputs: {},
      feedback: "The sum is: 60        ",
      program: `function main() {
          // define three numbers to add
          let num1 = 10;
          let num2 = 20;
          let num3 = 30;
          
          // add the three numbers together
          let sum = num1 + num2 + num3;
        
          // print the sum to the console
          console.log("The sum is:", sum);
      }`,
      __typename: "Validation",
    },
  },
  {
    validation: {
      id: "6278e8a0384d742c04cb3ef7",
      outputs: {},
      feedback: `
The minimum number is: 1
The maximum number is: 8   
      `,
      program: `
function main() {
  let numbers = [3, 6, 2, 8, 1];
  let min = Math.min(...numbers);
  let max = Math.max(...numbers);
  console.log("The minimum number is:", min);
  console.log("The maximum number is:", max);
}
     
      `,
      __typename: "Validation",
    },
  },
  {
    validation: {
      id: "6278e770384d743271cb3ef5",
      outputs: {},
      feedback: `
The minimum number is: 1
The maximum number is: 8   
      `,
      program: `
function main() {
  let numbers = [3, 6, 2, 8, 1];
  let min = Math.min(...numbers);
  let max = Math.max(...numbers);
  console.log("The minimum number is:", min);
  console.log("The maximum number is:", max);
}
     
      `,
      __typename: "Validation",
    },
  },
  {
    validation: {
      id: "6278e764384d747f1fcb3ef4",
      outputs: {},
      feedback: `
Uncaught TypeError: Math.min/max is not iterable
      `,
      program: `
function main() {
  let numbers = [3, 6, 2, 8, 1];
  let min = Math.min(numbers);
  let max = Math.max(numbers);
  console.log("The minimum number is:", min);
  console.log("The maximum number is:", max);
}      
      `,
      __typename: "Validation",
    },
  },
  {
    validation: {
      id: "6278e764384d747f1fcb3ef4",
      outputs: {},
      feedback: `
Uncaught TypeError: Math.min/max is not iterable
      `,
      program: `
function main() {
  let numbers = [3, 6, 2, 8, 1];
  let min = Math.min(numbers);
  let max = Math.max(numbers);
  console.log("The minimum number is:", min);
  console.log("The maximum number is:", max);
}      
      `,
      __typename: "Validation",
    },
  },
  {
    validation: {
      id: "6278e8ee384d74e132cb3efa",
      outputs: {},
      feedback: `
  The minimum number is: 1
  The maximum number is: 8   
      `,
      program: `
  function main() {
  let numbers = [3, 6, 2, 8, 1];
  let min = Math.min(...numbers);
  let max = Math.max(...numbers);
  console.log("The minimum number is:", min);
  console.log("The maximum number is:", max);
  }
     
      `,
      __typename: "Validation",
    },
  },
  {
    validation: {
      id: "6278e8e0384d746f85cb3ef9",
      outputs: {},
      feedback: `
  The minimum number is: 1
  The maximum number is: 8   
      `,
      program: `
  function main() {
  let numbers = [3, 6, 2, 8, 1];
  let min = Math.min(...numbers);
  let max = Math.max(...numbers);
  console.log("The minimum number is:", min);
  console.log("The maximum number is:", max);
  }
     
      `,
      __typename: "Validation",
    },
  },
  {
    validation: {
      id: "6278e764384d747f1fcb3ef4",
      outputs: {},
      feedback: `
Uncaught TypeError: Math.min/max is not iterable
      `,
      program: `
function main() {
  let numbers = [3, 6, 2, 8, 1];
  let min = Math.min(numbers);
  let max = Math.max(numbers);
  console.log("The minimum number is:", min);
  console.log("The maximum number is:", max);
}      
      `,
      __typename: "Validation",
    },
  },
  {
    validation: {
      id: "6278e97d384d746b76cb3efd",
      outputs: {},
      feedback: `
Uncaught TypeError: Math.min/max is not iterable
      `,
      program: `
function main() {
  let numbers = [3, 6, 2, 8, 1];
  let min = Math.min(numbers);
  let max = Math.max(numbers);
  console.log("The minimum number is:", min);
  console.log("The maximum number is:", max);
}      
      `,
      __typename: "Validation",
    },
  },
  {
    validation: {
      id: "6278e988384d74c827cb3efe",
      outputs: {},
      feedback: `
Uncaught TypeError: Math.min/max is not iterable
      `,
      program: `
function main() {
  let numbers = [3, 6, 2, 8, 1];
  let min = Math.min(numbers);
  let max = Math.max(numbers);
  console.log("The minimum number is:", min);
  console.log("The maximum number is:", max);
}      
      `,
      __typename: "Validation",
    },
  },
  {
    validation: {
      id: "6278e997384d74f024cb3f00",
      outputs: {},
      feedback: `
Uncaught TypeError: Math.min/max is not iterable
      `,
      program: `
function main() {
  let numbers = [3, 6, 2, 8, 1];
  let min = Math.min(numbers);
  let max = Math.max(numbers);
  console.log("The minimum number is:", min);
  console.log("The maximum number is:", max);
}      
      `,
      __typename: "Validation",
    },
  },
  {
    validation: {
      id: "6278e990384d746778cb3eff",
      outputs: {},
      feedback: `
Uncaught TypeError: Math.min/max is not iterable
      `,
      program: `
function main() {
  let numbers = [3, 6, 2, 8, 1];
  let min = Math.min(numbers);
  let max = Math.max(numbers);
  console.log("The minimum number is:", min);
  console.log("The maximum number is:", max);
}      
      `,
      __typename: "Validation",
    },
  },
  {
    validation: {
      id: "6278efb4e0569570c07849b8",
      outputs: {},
      feedback: `
The number is evenish
The number is evenish
      
      `,
      program: `
function oddishOrEvenish(num) {
  let sum = 0;
  while (num > 0) {
    sum += num % 10;
    num = Math.floor(num / 10);
  }
  if (sum % 2 === 0) {
    console.log("The number is evenish");
  } else {
    console.log("The number is oddish");
  }
}

// Example usage:
oddishOrEvenish(1234);
oddishOrEvenish(2468);
         
      `,
      __typename: "Validation",
    },
  },
  {
    validation: {
      id: "6278efd1e0569506cb7849b9",
      outputs: {},
      feedback: `
The number is evenish
The number is evenish
      
      `,
      program: `
function oddishOrEvenish(num) {
  let sum = 0;
  while (num > 0) {
    sum += num % 10;
    num = Math.floor(num / 10);
  }
  if (sum % 2 === 0) {
    console.log("The number is evenish");
  } else {
    console.log("The number is oddish");
  }
}

// Example usage:
oddishOrEvenish(1234);
oddishOrEvenish(2468);
         
      `,
      __typename: "Validation",
    },
  },
  {
    validation: {
      id: "6278f004e05695378b7849ba",
      outputs: {},
      feedback: `
The number is evenish
The number is evenish
      
      `,
      program: `
function oddishOrEvenish(num) {
  let sum = 0;
  while (num > 0) {
    sum += num % 10;
    num = Math.floor(num / 10);
  }
  if (sum % 2 === 0) {
    console.log("The number is evenish");
  } else {
    console.log("The number is oddish");
  }
}

// Example usage:
oddishOrEvenish(1234);
oddishOrEvenish(2468);
         
      `,
      __typename: "Validation",
    },
  },
  {
    validation: {
      id: "6278f02ae05695bf257849bc",
      outputs: {},
      feedback: `
The number is evenish
The number is evenish
      
      `,
      program: `
function oddishOrEvenish(num) {
  let sum = 0;
  while (num > 0) {
    sum += num % 10;
    num = Math.floor(num / 10);
  }
  if (sum % 2 === 0) {
    console.log("The number is evenish");
  } else {
    console.log("The number is oddish");
  }
}

// Example usage:
oddishOrEvenish(1234);
oddishOrEvenish(2468);
         
      `,
      __typename: "Validation",
    },
  },
  {
    validation: {
      id: "6278efa6e056956e887849b7",
      outputs: {},
      feedback: `
The number is evenish
The number is evenish
      
      `,
      program: `
function oddishOrEvenish(num) {
  let sum = 0;
  while (num > 0) {
    sum += num % 10;
    num = Math.floor(num / 10);
  }
  if (sum % 2 === 0) {
    console.log("The number is evenish");
  } else {
    console.log("The number is oddish");
  }
}

// Example usage:
oddishOrEvenish(1234);
oddishOrEvenish(2468);
         
      `,
      __typename: "Validation",
    },
  },
];

const mockValidationsData: getPlayerValidationsQuery = {
  player: {
    id: "6278d437384d748850cb3e34",
    validations: [
      {
        id: "6278e6dc384d7483d7cb3ee5",
        submittedAt: "2022-05-09T10:03:08.261Z",
        exerciseId: "ac123f69-a27e-433c-9455-480cf3f5c31d",
        language: "JavaScript",
        result: Result.ACCEPT,
        __typename: "Validation",
      },
      {
        id: "6278e6e9384d74636bcb3ee7",
        submittedAt: "2022-05-09T10:03:21.889Z",
        exerciseId: "ac123f69-a27e-433c-9455-480cf3f5c31d",
        language: "JavaScript",
        result: Result.ACCEPT,
        __typename: "Validation",
      },
      {
        id: "6278e764384d747f1fcb3ef4",
        submittedAt: "2022-05-09T10:05:24.455Z",
        exerciseId: "3e766a76-bd5e-480b-800f-31d1611b1e73",
        language: "JavaScript",
        result: Result.RUNTIME_ERROR,
        __typename: "Validation",
      },
      {
        id: "6278e770384d743271cb3ef5",
        submittedAt: "2022-05-09T10:05:36.925Z",
        exerciseId: "3e766a76-bd5e-480b-800f-31d1611b1e73",
        language: "JavaScript",
        result: Result.ACCEPT,
        __typename: "Validation",
      },
      {
        id: "6278e8a0384d742c04cb3ef7",
        submittedAt: "2022-05-09T10:10:40.953Z",
        exerciseId: "3e766a76-bd5e-480b-800f-31d1611b1e73",
        language: "JavaScript",
        result: Result.ACCEPT,
        __typename: "Validation",
      },
      {
        id: "6278e8e0384d746f85cb3ef9",
        submittedAt: "2022-05-09T10:11:44.783Z",
        exerciseId: "3e766a76-bd5e-480b-800f-31d1611b1e73",
        language: "JavaScript",
        result: Result.ACCEPT,
        __typename: "Validation",
      },
      {
        id: "6278e8ee384d74e132cb3efa",
        submittedAt: "2022-05-09T10:11:58.796Z",
        exerciseId: "3e766a76-bd5e-480b-800f-31d1611b1e73",
        language: "JavaScript",
        result: Result.ACCEPT,
        __typename: "Validation",
      },
      {
        id: "6278e97d384d746b76cb3efd",
        submittedAt: "2022-05-09T10:14:21.022Z",
        exerciseId: "3e766a76-bd5e-480b-800f-31d1611b1e73",
        language: "JavaScript",
        result: Result.RUNTIME_ERROR,
        __typename: "Validation",
      },
      {
        id: "6278e988384d74c827cb3efe",
        submittedAt: "2022-05-09T10:14:32.461Z",
        exerciseId: "3e766a76-bd5e-480b-800f-31d1611b1e73",
        language: "JavaScript",
        result: Result.RUNTIME_ERROR,
        __typename: "Validation",
      },
      {
        id: "6278e990384d746778cb3eff",
        submittedAt: "2022-05-09T10:14:40.879Z",
        exerciseId: "3e766a76-bd5e-480b-800f-31d1611b1e73",
        language: "JavaScript",
        result: Result.RUNTIME_ERROR,
        __typename: "Validation",
      },
      {
        id: "6278e997384d74f024cb3f00",
        submittedAt: "2022-05-09T10:14:47.367Z",
        exerciseId: "3e766a76-bd5e-480b-800f-31d1611b1e73",
        language: "JavaScript",
        result: Result.RUNTIME_ERROR,
        __typename: "Validation",
      },
      {
        id: "6278efa6e056956e887849b7",
        submittedAt: "2022-05-09T10:40:38.229Z",
        exerciseId: "32897c1a-da97-40c2-a9f5-8305fc310750",
        language: "JavaScript",
        result: Result.ACCEPT,
        __typename: "Validation",
      },
      {
        id: "6278efb4e0569570c07849b8",
        submittedAt: "2022-05-09T10:40:52.978Z",
        exerciseId: "32897c1a-da97-40c2-a9f5-8305fc310750",
        language: "JavaScript",
        result: Result.ACCEPT,
        __typename: "Validation",
      },
      {
        id: "6278efd1e0569506cb7849b9",
        submittedAt: "2022-05-09T10:41:21.202Z",
        exerciseId: "32897c1a-da97-40c2-a9f5-8305fc310750",
        language: "JavaScript",
        result: Result.ACCEPT,
        __typename: "Validation",
      },
      {
        id: "6278f004e05695378b7849ba",
        submittedAt: "2022-05-09T10:42:12.534Z",
        exerciseId: "32897c1a-da97-40c2-a9f5-8305fc310750",
        language: "JavaScript",
        result: Result.ACCEPT,
        __typename: "Validation",
      },
      {
        id: "6278f02ae05695bf257849bc",
        submittedAt: "2022-05-09T10:42:50.919Z",
        exerciseId: "32897c1a-da97-40c2-a9f5-8305fc310750",
        language: "JavaScript",
        result: Result.ACCEPT,
        __typename: "Validation",
      },
    ],
    __typename: "Player",
  },
};

export default mockValidationsData;
