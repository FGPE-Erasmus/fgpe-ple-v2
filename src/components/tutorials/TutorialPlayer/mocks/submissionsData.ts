import { getPlayerSubmissionsQuery } from "../../../../generated/getPlayerSubmissionsQuery";
import { Result } from "../../../../generated/globalTypes";

export const mockSubmissions = [
  {
    submission: {
      id: "6278e6cd384d742fe6cb3ee2",
      feedback:
        '<br><table width="100%" cellspacing="2" cellpadding="2" rules="all" frame="box"><tr><th>#</th><th>Result</th><th>Points</th><th>Hint</th><th>Test Data</th></tr><tr><td>1</td><td><font color="green">Accepted</font></td><td>1</td><td>Test completed</td><td><font color="grey">unavailable</font></td></tr></table>',
      program: `
function main() {
    // define three numbers to add
    let num1 = 10;
    let num2 = 20;
    let num3 = 30;
    
    // add the three numbers together
    let sum = num1 + num2 + num3;
  
    // print the sum to the console
    console.log("The sum is:", sum);
}
      `,
      __typename: "Submission",
    },
  },
  {
    submission: {
      id: "6278e6ef384d740bb9cb3ee8",
      feedback:
        '<br><table width="100%" cellspacing="2" cellpadding="2" rules="all" frame="box"><tr><th>#</th><th>Result</th><th>Points</th><th>Hint</th><th>Test Data</th></tr><tr><td>1</td><td><font color="green">Accepted</font></td><td>1</td><td>Test completed</td><td><font color="grey">unavailable</font></td></tr></table>',
      program: `
function main() {
    // define three numbers to add
    let num1 = 10;
    let num2 = 20;
    let num3 = 30;
    
    // add the three numbers together
    let sum = num1 + num2 + num3;
  
    // print the sum to the console
    console.log("The sum is:", sum);
}
      `,
      __typename: "Submission",
    },
  },
  {
    submission: {
      id: "6278e8dd384d744744cb3ef8",
      feedback:
        '<br><table width="100%" cellspacing="2" cellpadding="2" rules="all" frame="box"><tr><th>#</th><th>Result</th><th>Points</th><th>Hint</th><th>Test Data</th></tr><tr><td>1</td><td><font color="green">Accepted</font></td><td>1</td><td>Test completed</td><td><font color="grey">unavailable</font></td></tr></table>',
      program: `
function findMinMax(numbers) {
  let min = numbers[0];
  let max = numbers[0];

  for (let i = 1; i < numbers.length; i++) {
    if (numbers[i] < min) {
      min = numbers[i];
    } else if (numbers[i] > max) {
      max = numbers[i];
    }
  }

  return [max, min];
}

function main() {
  let numbers = [5, 2, 8, 1, 9, 4];
  let [min, max] = findMinMax(numbers);

  console.log("The minimum value is:", min);
  console.log("The maximum value is:", max);
}
      `,
      __typename: "Submission",
    },
  },
  {
    submission: {
      id: "6278e88b384d741e2acb3ef6",
      feedback:
        '<br><table width="100%" cellspacing="2" cellpadding="2" rules="all" frame="box"><tr><th>#</th><th>Result</th><th>Points</th><th>Hint</th><th>Test Data</th></tr><tr><td>1</td><td><font color="green">Accepted</font></td><td>1</td><td>Test completed</td><td><font color="grey">unavailable</font></td></tr></table>',
      program: `
function findMinMax(numbers) {
  let min = numbers[0];
  let max = numbers[0];

  for (let i = 1; i < numbers.length; i++) {
    if (numbers[i] < min) {
      min = numbers[i];
    } else if (numbers[i] > max) {
      max = numbers[i];
    }
  }

  return [max, min];
}

function main() {
  let numbers = [5, 2, 8, 1, 9, 4];
  let [min, max] = findMinMax(numbers);

  console.log("The minimum value is:", min);
  console.log("The maximum value is:", max);
}
      `,
      __typename: "Submission",
    },
  },
  {
    submission: {
      id: "6278ea40384d741bcacb3f01",
      feedback:
        '<br><table width="100%" cellspacing="2" cellpadding="2" rules="all" frame="box"><tr><th>#</th><th>Result</th><th>Points</th><th>Hint</th><th>Test Data</th></tr><tr><td>1</td><td><font color="green">Accepted</font></td><td>1</td><td>Test completed</td><td><font color="grey">unavailable</font></td></tr></table>',
      program: `
function main() {
  function findMinMax(numbers) {
    let min = numbers[0];
    let max = numbers[0];
  
    for (let i = 1; i < numbers.length; i++) {
      if (numbers[i] < min) {
        min = numbers[i];
      } else if (numbers[i] > max) {
        max = numbers[i];
      }
    }
  
    return [min, max];
  }

  let numbers = [5, 2, 8, 1, 9, 4];
  let [min, max] = findMinMax(numbers);

  console.log("The minimum value is:", min);
  console.log("The maximum value is:", max);
}
      `,
      __typename: "Submission",
    },
  },
  {
    submission: {
      id: "6278e97a384d747269cb3efc",
      feedback:
        '<br><table width="100%" cellspacing="2" cellpadding="2" rules="all" frame="box"><tr><th>#</th><th>Result</th><th>Points</th><th>Hint</th><th>Test Data</th></tr><tr><td>1</td><td><font color="green">Accepted</font></td><td>1</td><td>Test completed</td><td><font color="grey">unavailable</font></td></tr></table>',
      program: `
function main(numbers) {
  let min = numbers[0];
  let max = numbers[0];

  for (let i = 1; i <= numbers.length; i++) {
    if (numbers[i] < min) {
      min = numbers[i];
    } else if (numbers[i] > max) {
      max = numbers[i];
    }
  }

  return [min, max];
}
      
      `,
      __typename: "Submission",
    },
  },
  {
    submission: {
      id: "6278f031e056956bba7849be",
      feedback:
        '<br><table width="100%" cellspacing="2" cellpadding="2" rules="all" frame="box"><tr><th>#</th><th>Result</th><th>Points</th><th>Hint</th><th>Test Data</th></tr><tr><td>1</td><td><font color="green">Accepted</font></td><td>1</td><td>Test completed</td><td><font color="grey">unavailable</font></td></tr></table>',
      program: `function main(num) {
        let sum = 0;
      
        // add up the digits of the number
        while (num > 0) {
          sum += num % 10;
          num = Math.floor(num / 10);
        }
      
        // determine if the sum is odd or even
        if (sum % 2 == 0) {
          return "Evenish";
        } else {
          return "Oddish";
        }
      }
      
      // example usage
      console.log(oddishOrEvenish(43));  // Output: "Oddish"
      console.log(oddishOrEvenish(444)); // Output: "Evenish"
      
      `,
      __typename: "Submission",
    },
  },
  {
    submission: {
      id: "6278e966384d746609cb3efb",
      feedback:
        '<br><table width="100%" cellspacing="2" cellpadding="2" rules="all" frame="box"><tr><th>#</th><th>Result</th><th>Points</th><th>Hint</th><th>Test Data</th></tr><tr><td>1</td><td><font color="green">Accepted</font></td><td>1</td><td>Test completed</td><td><font color="grey">unavailable</font></td></tr></table>',
      program: `
function main(numbers) {
  let min = numbers[0];
  let max = numbers[0];

  for (let i = 1; i <= numbers.length; i++) {
    if (numbers[i] < min) {
      min = numbers[i];
    } else if (numbers[i] > max) {
      max = numbers[i];
    }
  }

  return [min, max];
}
      
      `,
      __typename: "Submission",
    },
  },
  {
    submission: {
      id: "6278f009e05695430a7849bb",
      feedback: "<br>",
      program: `
      function oddishOrEvenish(num) {
        let sum = 0;
      
        // add up the digits of the number
        while (num > 0) {
          sum += num % 9;
          num = Math.floor(num / 10);
        }
      
        // determine if the sum is odd or even
        if (sum % 2 == 0) {
          return "Oddish";
        } else {
          return "Evenish";
        }
      }
      
      // example usage
      console.log(oddishOrEvenish(43));
      console.log(oddishOrEvenish(444));
      
      
      `,
      __typename: "Submission",
    },
  },
  {
    submission: {
      id: "6278f02de0569507aa7849bd",
      feedback: "<br>",
      program: `
      function oddishOrEvenish(num) {
        let sum = 0;
      
        // add up the digits of the number
        while (num > 0) {
          sum += num % 9;
          num = Math.floor(num / 10);
        }
      
        // determine if the sum is odd or even
        if (sum % 2 == 0) {
          return "Oddish";
        } else {
          return "Evenish";
        }
      }
      
      // example usage
      console.log(oddishOrEvenish(43));
      console.log(oddishOrEvenish(444));
      
      
      `,
      __typename: "Submission",
    },
  },
  {
    submission: {
      id: "6278ef9fe056955fc27849b6",
      feedback: "<br>",
      program: `
      function oddishOrEvenish(num) {
        let sum = 0;
      
        // add up the digits of the number
        while (num > 0) {
          sum += num % 9;
          num = Math.floor(num / 10);
        }
      
        // determine if the sum is odd or even
        if (sum % 2 == 0) {
          return "Oddish";
        } else {
          return "Evenish";
        }
      }
      
      // example usage
      console.log(oddishOrEvenish(43));
      console.log(oddishOrEvenish(444));
      
      
      `,
      __typename: "Submission",
    },
  },
  {
    submission: {
      id: "6278f23ae056954f077849cd",
      feedback: "<br>",
      program: `
// array of words to add suffix to
let words = ["cat", "dog", "bird", "fish"];

// function to add a suffix to a word
function addSuffix(suffix) {
  // return an anonymous function that adds the suffix to a given word
  return function(word) {
    return word + suffix;
  };
}

// example usage: add "-like" suffix to all words in the array
let addLike = addSuffix("-like");
let modifiedWords = words.map(addLike);

// print the modified words to the console
console.log(modifiedWords); // Output: ["cat-like", "dog-like", "bird-like", "fish-like"]
      `,
      __typename: "Submission",
    },
  },
];

const mockSubmissionsData: getPlayerSubmissionsQuery = {
  player: {
    id: "6278d437384d748850cb3e34",
    submissions: [
      {
        id: "6278e6cd384d742fe6cb3ee2",
        submittedAt: "2022-05-09T10:02:53.573Z",
        exerciseId: "ac123f69-a27e-433c-9455-480cf3f5c31d",
        language: "JavaScript",
        result: Result.ACCEPT,
        __typename: "Submission",
      },
      {
        id: "6278e6ef384d740bb9cb3ee8",
        submittedAt: "2022-05-09T10:03:27.580Z",
        exerciseId: "ac123f69-a27e-433c-9455-480cf3f5c31d",
        language: "JavaScript",
        result: Result.ACCEPT,
        __typename: "Submission",
      },
      {
        id: "6278e88b384d741e2acb3ef6",
        submittedAt: "2022-05-09T10:10:19.639Z",
        exerciseId: "3e766a76-bd5e-480b-800f-31d1611b1e73",
        language: "JavaScript",
        result: Result.WRONG_ANSWER,
        __typename: "Submission",
      },
      {
        id: "6278e8dd384d744744cb3ef8",
        submittedAt: "2022-05-09T10:11:41.773Z",
        exerciseId: "3e766a76-bd5e-480b-800f-31d1611b1e73",
        language: "JavaScript",
        result: Result.WRONG_ANSWER,
        __typename: "Submission",
      },
      {
        id: "6278e966384d746609cb3efb",
        submittedAt: "2022-05-09T10:13:58.523Z",
        exerciseId: "3e766a76-bd5e-480b-800f-31d1611b1e73",
        language: "JavaScript",
        result: Result.RUNTIME_ERROR,
        __typename: "Submission",
      },
      {
        id: "6278e97a384d747269cb3efc",
        submittedAt: "2022-05-09T10:14:18.462Z",
        exerciseId: "3e766a76-bd5e-480b-800f-31d1611b1e73",
        language: "JavaScript",
        result: Result.RUNTIME_ERROR,
        __typename: "Submission",
      },
      {
        id: "6278ea40384d741bcacb3f01",
        submittedAt: "2022-05-09T10:17:36.490Z",
        exerciseId: "3e766a76-bd5e-480b-800f-31d1611b1e73",
        language: "JavaScript",
        result: Result.ACCEPT,
        __typename: "Submission",
      },
      {
        id: "6278ef9fe056955fc27849b6",
        submittedAt: "2022-05-09T10:40:31.919Z",
        exerciseId: "32897c1a-da97-40c2-a9f5-8305fc310750",
        language: "JavaScript",
        result: Result.WRONG_ANSWER,
        __typename: "Submission",
      },
      {
        id: "6278f009e05695430a7849bb",
        submittedAt: "2022-05-09T10:42:17.797Z",
        exerciseId: "32897c1a-da97-40c2-a9f5-8305fc310750",
        language: "JavaScript",
        result: Result.WRONG_ANSWER,
        __typename: "Submission",
      },
      {
        id: "6278f02de0569507aa7849bd",
        submittedAt: "2022-05-09T10:42:53.509Z",
        exerciseId: "32897c1a-da97-40c2-a9f5-8305fc310750",
        language: "JavaScript",
        result: Result.WRONG_ANSWER,
        __typename: "Submission",
      },
      {
        id: "6278f031e056956bba7849be",
        submittedAt: "2022-05-09T10:42:57.141Z",
        exerciseId: "32897c1a-da97-40c2-a9f5-8305fc310750",
        language: "JavaScript",
        result: Result.ACCEPT,
        __typename: "Submission",
      },
      {
        id: "6278f23ae056954f077849cd",
        submittedAt: "2022-05-09T10:51:38.735Z",
        exerciseId: "db6a4f54-2aeb-4502-823a-92914aa8e60b",
        language: "JavaScript",
        result: Result.ACCEPT,
        __typename: "Submission",
      },
    ],
    __typename: "Player",
  },
};

export default mockSubmissionsData;
