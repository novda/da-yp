export function generateData(
  count: number,
  [from, to]: number[],
  mean: number,
  sd: number
): number[] {
  function randomList(n: number, a: number, b: number) {
    let list = [],
      i;
    for (i = 0; i < n; i++) {
      list[i] = Math.random() * (b - a) + a;
    }
    return list;
  }

  function descriptives(list: number[]) {
    let mean,
      sd,
      i,
      len = list.length,
      sum,
      a = Infinity,
      b = -a;
    for (sum = i = 0; i < len; i++) {
      sum += list[i];
      a = Math.min(a, list[i]);
      b = Math.max(b, list[i]);
    }
    mean = sum / len;
    for (sum = i = 0; i < len; i++) {
      sum += (list[i] - mean) * (list[i] - mean);
    }
    sd = Math.sqrt(sum / (len - 1));
    return {
      mean: mean,
      sd: sd,
      range: [a, b],
    };
  }

  function forceDescriptives(list: number[], mean: number, sd: number) {
    let oldDescriptives = descriptives(list),
      oldMean = oldDescriptives.mean,
      oldSD = oldDescriptives.sd,
      newList = [],
      len = list.length,
      i;
    for (i = 0; i < len; i++) {
      newList[i] = (sd * (list[i] - oldMean)) / oldSD + mean;
    }
    return newList;
  }

  const list = randomList(count, from, to);

  return forceDescriptives(list, mean, sd);
}
