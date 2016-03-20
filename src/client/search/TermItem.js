import React, { Component } from 'react';

const TermItem = ({ onDeleteClick, onToggleParamTypeClick, query, source, paramTypes }) => (
  <div className="ui multiple compact dropdown labeled icon violet button"
    onClick={(ee) => ee.stopPropagation()}
  >
    <span>
      <i className={`${source} icon`}></i>
      {query}
    </span>
    <i className="delete icon" onClick={() => {
      onDeleteClick();
    }}
    ></i>
    <TermItemMenu
      paramTypes={paramTypes}
      onToggleParamType={(paramTypeToggle) => onToggleParamTypeClick(paramTypeToggle)}
    />
  </div>
);

class TermItemMenu extends Component {
  componentDidMount() {
    $('.ui.dropdown')
      .dropdown({
        action: (value, text) => {
          this.props.onToggleParamType(text);
        }
      });
  }

  render() {
    const menuItems = this.props.paramTypes.map((paramType, id) => {
      let content;
      if (paramType.icon.length > 1) {
        content = <i className={paramType.icon}></i>;
      } else {
        content = <i className="icon">{paramType.icon}</i>;
      }
      return (
        <div key={id} data-value={paramType.name} className="item">
          {content} HELLO
          {id}
          {paramType.name}
        </div>
      );
    });

    return (
      <div className="menu">
        {menuItems}
      </div>
    );
  }
}

export default TermItem;
