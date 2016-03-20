import React, { Component } from 'react';

const TermItem = ({ onDeleteClick, query, source, paramTypes }) => {
  let termClass = 'ui multiple compact dropdown labeled icon ';
  switch (source) {
  case 'twitter':
    termClass += 'blue button';
    break;
  default:
    termClass += 'button';
  }

  const paramTypeIcons = paramTypes.map((paramType) => {
    if (paramType.icon.length > 1) {
      return <i className={paramType.icon}></i>;
    }
    return <i className="icon">{paramType.icon}</i>;
  });

  return (
    <div className={termClass} onClick={(ee) => ee.stopPropagation()}>
      <span>
        <i className="twitter icon"></i>
        {query}
      </span>
      <i className="delete icon" onClick={() => {
        onDeleteClick();
      }}
      ></i>
      <TermItemMenu menuItemsContent={paramTypeIcons} />
    </div>
  );
};

class TermItemMenu extends Component {
  componentDidMount() {
    $('.ui.dropdown')
      .dropdown({
        onChange: (value, text, $selectedItem) => {

        }
      });
  }

  render() {
    const menuItems = this.props.menuItemsContent.map((content, id) => (
      <div key={id} className="item">
        {content}
      </div>
    ));

    return (
      <div className="menu">
        {menuItems}
      </div>
    );
  }
}

export default TermItem;
