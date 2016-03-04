import { BuilderDecorator } from 'js-builder-decorator';

export class Tweet {
  constructor() {
    this.tweeter = null;
    this.content = null;
    this.date = null;
  }
}

export const TweetBuilder = BuilderDecorator.BuilderDecorator(
  Tweet,
  { 'allFieldsMustBeSet': true }
);
