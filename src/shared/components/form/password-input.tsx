import { useState, type ComponentProps } from 'react';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { cn } from 'cn';
import { useT } from '@core/i18n/use-i18n';
import { Button } from '@shared/ui/button';
import { Input } from '@shared/ui/input';

export type PasswordInputProps = Omit<ComponentProps<'input'>, 'type'>;

export function PasswordInput({ className, disabled, ...props }: PasswordInputProps) {
  const [visible, setVisible] = useState(false);
  const t = useT();

  return (
    <div className="relative flex items-center">
      <Input
        type={visible ? 'text' : 'password'}
        disabled={disabled}
        className={cn('pr-11', className)}
        {...props}
      />
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        tabIndex={-1}
        disabled={disabled}
        aria-label={t(visible ? 'auth.password.hide' : 'auth.password.show')}
        onClick={() => {
          setVisible((prev) => !prev);
        }}
        className="absolute right-1 text-muted-foreground hover:text-foreground"
      >
        {visible ? <EyeOffIcon aria-hidden /> : <EyeIcon aria-hidden />}
      </Button>
    </div>
  );
}
