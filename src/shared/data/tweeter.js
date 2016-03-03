import { BuilderDecorator } from 'js-builder-decorator';

export class Tweeter {
  constructor() {
    this.name = null;
    this.handle = null;
  }
}

export const TweeterBuilder = BuilderDecorator.BuilderDecorator(
  Tweeter,
  { 'allFieldsMustBeSet': true }
);
