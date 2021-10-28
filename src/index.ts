import Invoices from './invoices';
import Plays from './plays';

export const statement = (invoice: any, plays: any) => {
  return renderPlainText(createStatementData(invoice, plays));
};

export const createStatementData = (invoice: any, plays: any) => {
  const enrichPerformance = (aPerformance: any) => {
    const result = Object.assign({}, aPerformance);
    result.play = playFor(result);
    result.amount = amountFor(result);
    result.volumeCredits = volumeCreditsFor(result);
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
  const volumeCreditsFor = (aPerformance: any) => {
    let volumeCredits = 0;
    volumeCredits += Math.max(aPerformance.audience - 30, 0);

    if ('comedy' === aPerformance.play.type) {
      volumeCredits += Math.floor(aPerformance.audience / 5);
    }

    return volumeCredits;
  };

  const playFor = (aPerformance: any) => {
    return plays[aPerformance.playID];
  };

  const amountFor = (aPerformance: any) => {
    let result = 0;
    switch (aPerformance.play.type) {
      case 'tragedy':
        result = 40000;
        if (aPerformance.audience > 30) {
          result += 1000 * (aPerformance.audience - 30);
        }
        break;

      case 'comedy':
        result = 30000;
        if (aPerformance.audience > 20) {
          result += 10000 + 500 * (aPerformance.audience - 30);
        }
        result += 300 * aPerformance.audience;
        break;

      default:
        throw new Error(`알 수 없는 장르: ${aPerformance.play.type}`);
    }

    return result;
  };

  let statementData: any = {};
  statementData.customer = invoice.customer;
  statementData.performances = invoice.performances.map(enrichPerformance);
  statementData.totalAmount = totalAmount(statementData);
  statementData.totalVolumeCredits = totalVolumeCredits(statementData);

  return statementData;
};

export const renderPlainText = (data: any) => {
  const usd = (aNumber: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(aNumber / 100);
  };
  let result = `청구 내역 (고객명: ${data.customer})\n`;

  for (let perf of data.performances) {
    result += ` ${perf.play.name}: ${usd(perf.amount)} (${perf.audience}석)\n`;
  }

  result += `총액: ${usd(data.totalAmount)}\n`;
  result += `적립 포인트: ${data.totalVolumeCredits}점\n`;
  return result;
};
