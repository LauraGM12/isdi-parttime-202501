const reactElement = React.createElement;

const mainContainer = document.getElementById('app');
const root = ReactDOM.createRoot(mainContainer);

root.render(reactElement(App));