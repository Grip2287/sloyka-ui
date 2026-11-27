function Dec(): ClassDecorator & PropertyDecorator {
  return () => {};
}

@Dec()
export class Widget {
  @Dec() prop = 1;
  constructor(@Dec() readonly dep: string) {}
}
