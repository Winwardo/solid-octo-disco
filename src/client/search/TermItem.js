import React, { Component } from 'react';

const TermItem = ({ onDeleteClick, onToggleParamTypeClick, query, source, paramTypes, id }) => (
  <div data-id={id} className="ui multiple compact dropdown labeled icon violet button"
    onClick={(e) => e.stopPropagation()}
  >
    <span>
      <i className={`${source} icon`}></i>
      {query}
    </span>
    <i className="delete icon" onClick={() => onDeleteClick()}></i>
    <TermItemMenu
      termId={id}
      highlightColor={source === 'twitter' ? 'blue' : ''}
      paramTypes={paramTypes}
      onToggleParamType={(paramTypeToggle) => onToggleParamTypeClick(paramTypeToggle)}
    />
  </div>
);

class TermItemMenu extends Component {
  componentDidMount() {
    $(`.ui.dropdown[data-id="${this.props.termId}"]`)
      .dropdown({
        transition: 'drop',
        action: (value, text) => {
          this.props.onToggleParamType(text);
        }
      });
  }

  render() {
    const menuItems = this.props.paramTypes.map((paramType, id) => {
      let paramTypeIcon;
      const highlighted = paramType.selected ? this.props.highlightColor : 'black';
      if (paramType.icon.length > 1) {
        paramTypeIcon = <i className={`inverted ${highlighted} circular ${paramType.icon}`}></i>;
      } else {
        paramTypeIcon = <i className={`inverted ${highlighted} circular icon`}>{paramType.icon}</i>;
      }
      return (
        <div key={id} data-value={paramType.name} className="item">
          {paramTypeIcon}
          <span className={`ui ${highlighted} label`}>{paramType.name}</span>
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
