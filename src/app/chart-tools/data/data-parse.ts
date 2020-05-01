import { INewsITem } from './fake-news';

export interface IAggregatedNews {
  id: string;
  topicName: string;
  date: number;
  amount: number;
}

export const getAllDifferentTopics = (fakeNewsDefault: INewsITem[]) => {
  let newGeneratedArray = [];

  fakeNewsDefault.map((newsElement: INewsITem) => {
    if (newGeneratedArray.indexOf(newsElement.topicName) === -1) {
      newGeneratedArray = [...newGeneratedArray, newsElement.topicName];
    }
  });

  return newGeneratedArray;
};

export const getAggregatedArticles = (fakeNewsDefault: INewsITem[]) => {
  let newGeneratedArray = [];

  fakeNewsDefault.map((newsElement: INewsITem) => {
    if (newGeneratedArray.indexOf(newsElement.topicName) === -1) {
      newGeneratedArray = [...newGeneratedArray, newsElement.topicName];
    }
  });

  return newGeneratedArray;
};
