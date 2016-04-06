import React, { Component } from 'react';

const TermItem = ({ onDeleteClick, onToggleParamTypeClick, query, source, paramTypes, id }) => (
  <div data-id={id} className="ui multiple dropdown labeled icon violet button"
    onClick={(e) => e.stopPropagation()}
  >
    <div className="ui grid">
      <div className="two wide middle aligned column" style={{ paddingLeft: 0 }}>
        <i className={`large blue ${source} icon`}></i>
      </div>
      <div className="thirteen wide center aligned column">
        <div style={{ fontSize: '1.25em', whiteSpace: 'nowrap', paddingBottom: '5px' }}>
          {query}
        </div>
        <div>
          {paramTypes
            .filter((paramType) => paramType.selected)
            .map((paramType, id) => {
              if (paramType.icon.length > 1) {
                return (
                  <i key={id} className={`tiny inverted blue circular ${paramType.icon} param types popup`}
                    data-title={`Search by ${paramType.name}`}
                  ></i>
                );
              } else {
                return (
                  <i key={id} className={'tiny inverted blue circular icon param types popup'}
                    data-title={`Search by ${paramType.name}`}
                  >
                    {paramType.icon}
                  </i>
                );
              }
            })
          }
        </div>
        <div>
          <i className="dropdown icon" style={{ paddingTop: 0, paddingRight: '25px' }}></i>
        </div>
      </div>
    </div>
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
        },
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
