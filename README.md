# @just-web-tech/easy-modals

A simple and convenient solution for managing the state of modals. Fast, clear and without unnecessary effort

<a href="https://www.npmjs.com/package/@just-web-tech/easy-modals">
  <img alt="npm version" src="https://img.shields.io/npm/v/%40just-web-tech%2Feasy-modals?style=flat" />
</a>
<a href="https://www.npmjs.com/package/@just-web-tech/easy-modals">
  <img alt="npm downloads" src="https://img.shields.io/npm/dw/%40just-web-tech%2Feasy-modals?style=flat" />
</a>
<a href="https://github.com/just-web-tech/easy-modals/blob/master/LICENSE">
  <img alt="npm license" src="https://img.shields.io/npm/l/%40just-web-tech%2Feasy-modals?style=flat" />
</a>
<a href="https://github.com/just-web-tech/easy-modals">
  <img alt="npm stars" src="https://img.shields.io/github/stars/just-web-tech/easy-modals?style=flat" />
</a>

## Features

- 🔑 Type safe
- ⚡️ No dependencies
- 📦 ~ 2 kb size (gzip)
- 🔥 Life cycle like pages
- 💡 Transitions doesn't break
- 🌚 Support any UI
- 🌟 No extra renders

## Install

```sh
npm i @just-web-tech/easy-modals
```

## Usage

### Global

```tsx
const modal = modals.create<string>();

const Component = () => {
  const state = modal.useState();

  return (
    <Modal
      open={state.visible}
      onCancel={state.close}
      afterClose={state.remove}
      onOk={state.close}
    >
      {state.data}
    </Modal>
  );
};

modal.register(Component);
```

Add **ModalsRegistry** as high as possible

```tsx
const App = () => (
  <Fragment>
    {children}
    <ModalsRegistry />
  <Fragment>
);
```

Example:

```tsx
modal.open('Lorem ipsum dorem');
```

### Declarative

The modal can be declared as a regular component. But in this case, you need to use **define** instead of register \
For example, this method can be useful if you want to use context

```tsx
const modal = modals.create<string>();
const SomeModal = modal.define(Component);
```

Example:

```tsx
<Fragment>
  <Button onClick={() => modal.open('message')}>
    Show
  </Button>
  <SomeModal />
</Fragment>
```

> [!NOTE]
> To avoid conflicts and improve type safety, component should not accept **props** \
> However, you can pass same data via modal state or Context API
>
> NOTE: **define**  automatically adds `memo`, so components never need to be wrap

## Other

### Keep mounted

Don't use **remove** method after close. The modal will remain in the markup and will not be removed

```diff
- afterClose={state.remove}
```

### Update state

Use the **update** method to change the state

```tsx
const modal = modals.create<number>();
modal.update((prev) => prev + 1);
```

### Close every

Closes all visible modals

```tsx
modals.close();
```

### Any visible

Using this method, you can check if at least one modal is open

```tsx
modals.anyVisible();
```

### Close latest

If you need to close the last opened modal, use this

```tsx
modals.closeLatest();
```

### Testing

Add clearing of modal states

```tsx
afterEach(modals.cleanup);
```

Now you can write tests as you are used to

```tsx
it('works', () => {
  render(<ModalsRegistry />);

  const modal = modals.create();
  act(() => modal.register(Modal));

  act(() => modal.open());
  expect(screen.getByRole('dialog')).toBeInTheDocument();
});
```

Or the declarative way

```tsx
it('works', () => {
  const modal = modals.create();
  const Component = modal.define(Modal);

  render(<Component />);

  act(() => modal.open());
  expect(screen.getByRole('dialog')).toBeInTheDocument();
});
```
