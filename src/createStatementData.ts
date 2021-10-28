class PerformanceCalculator {
  performance: any;
  play: any;

  constructor(aPerformance: any, aPlay: any) {
    this.performance = aPerformance;
    this.play = aPlay;
  }

  get amount() {
    let result = 0;
    switch (this.play.type) {
      case 'tragedy':
        result = 40000;
        if (this.performance.audience > 30) {
          result += 1000 * (this.performance.audience - 30);
        }
        break;

      case 'comedy':
        result = 30000;
        if (this.performance.audience > 20) {
          result += 10000 + 500 * (this.performance.audience - 30);
        }
        result += 300 * this.performance.audience;
        break;

      default:
        throw new Error(`알 수 없는 장르: ${this.play.type}`);
    }

    return result;
  }

  get volumeCredits() {
    let volumeCredits = 0;
    volumeCredits += Math.max(this.performance.audience - 30, 0);

    if ('comedy' === this.play.type) {
      volumeCredits += Math.floor(this.performance.audience / 5);
    }

    return volumeCredits;
  }
}

export const createStatementData = (invoice: any, plays: any) => {
  const enrichPerformance = (aPerformance: any) => {
    const calculator = new PerformanceCalculator(aPerformance, playFor(aPerformance));
    const result = Object.assign({}, aPerformance);
    result.play = calculator.play;
    result.amount = calculator.amount;
    result.volumeCredits = calculator.volumeCredits;
    return result;
  };

  const totalVolumeCredits = (data: any) => {
    return data.performances.reduce((total: number, p: any) => total + p.volumeCredits, 0);
  };

  const totalAmount = (data: any) => {
    let result = 0;
    for (let perf of data.performances) {
      result += perf.amount;
    }

    return data.performances.reduce((total: number, p: any) => total + p.amount, 0);
  };
  const playFor = (aPerformance: any) => {
    return plays[aPerformance.playID];
  };

  const volumeCreditsFor = (aPerformance: any) => {
    return new PerformanceCalculator(aPerformance, playFor(aPerformance)).volumeCredits;
  };

  const amountFor = (aPerformance: any) => {
    return new PerformanceCalculator(aPerformance, playFor(aPerformance)).amount;
  };

  let result: any = {};
  result.customer = invoice.customer;
  result.performances = invoice.performances.map(enrichPerformance);
  result.totalAmount = totalAmount(result);
  result.totalVolumeCredits = totalVolumeCredits(result);

  return result;
};
