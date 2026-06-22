export class WebResponseSuccess<T> {
  data: T;

  constructor(data: T) {
    this.data = data;
  }
}

export class WebResponseError<T> {
  title: string;
  status: number;
  detail: string;
  errors: T;

  constructor({
    title,
    status,
    detail,
    errors,
  }: Readonly<{
    title: string;
    status: number;
    detail: string;
    errors: T;
  }>) {
    this.title = title;
    this.status = status;
    this.detail = detail;
    this.errors = errors;
  }
}
