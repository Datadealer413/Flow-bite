import { createPopper, Instance, Placement } from '@popperjs/core';
import { FC, ReactNode, useEffect, useRef, useState } from 'react';
import classNames from 'classnames';

export type TooltipProps = {
  content: ReactNode;
  placement?: Placement;
  trigger?: 'hover' | 'click';
  style?: 'dark' | 'light';
  animation?: false | `duration-${string}`;
  arrow?: boolean;
};

export const Tooltip: FC<TooltipProps> = ({
  children,
  content,
  placement = 'top',
  trigger = 'hover',
  style = 'dark',
  animation = 'duration-300',
  arrow = true,
}) => {
  const tooltipRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLSpanElement>(null);
  const popperInstance = useRef<Instance>();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (wrapperRef.current && tooltipRef.current) {
      popperInstance.current = createPopper(wrapperRef.current, tooltipRef.current, {
        placement,
        modifiers: [
          {
            name: 'offset',
            options: {
              offset: [0, 8],
            },
          },
          { name: 'eventListeners', enabled: true },
        ],
      });
    }
  }, [placement]);

  const show = () => {
    setVisible(true);
    popperInstance.current?.update();
  };

  const hide = () => setVisible(false);

  return (
    <>
      <div
        className={classNames(
          'inline-block absolute z-10 py-2 px-3 text-sm font-medium rounded-lg shadow-sm tooltip',
          animation !== false && `transition-opacity ${animation}`,
          {
            'invisible opacity-0': !visible,
            'text-white bg-gray-900 dark:bg-gray-700': style === 'dark',
            'text-gray-900 bg-white border border-gray-200': style === 'light',
          },
        )}
        ref={tooltipRef}
        role="tooltip"
      >
        {content}
        {arrow && <div className="tooltip-arrow" data-popper-arrow />}
      </div>
      <span
        ref={wrapperRef}
        onFocus={show}
        onBlur={hide}
        {...(trigger === 'hover' ? { onMouseEnter: show, onMouseLeave: hide } : { onClick: show })}
      >
        {children}
      </span>
    </>
  );
};
