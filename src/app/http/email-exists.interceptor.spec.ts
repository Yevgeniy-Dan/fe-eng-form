import { TestBed } from '@angular/core/testing';

import { EmailExistsInterceptor } from './email-exists.interceptor';

describe('ApiInterceptorInterceptor', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [EmailExistsInterceptor],
    })
  );

  it('should be created', () => {
    const interceptor: EmailExistsInterceptor = TestBed.inject(
      EmailExistsInterceptor
    );
    expect(interceptor).toBeTruthy();
  });
});
