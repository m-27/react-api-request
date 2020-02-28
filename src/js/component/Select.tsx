/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';

interface SelectPrpps {
  list: any[],
  handleChange: any,
  defaultValue:string,
  flag: number,
  selected:string
}

interface SelectState{
  listVisible: boolean,
}

class Select extends React.Component<SelectPrpps, SelectState> {
  constructor(props:any){
    super(props);

    this.state = {
        listVisible: false,
    };

    this.showDropdownMenu = this.showDropdownMenu.bind(this);
    this.hideDropdownMenu = this.hideDropdownMenu.bind(this);

  };

  select(elem?:any){
    this.props.handleChange(elem);
  }

  showDropdownMenu(event: { preventDefault: () => void; }) {
    event.preventDefault();
    this.setState({ listVisible: true }, () => {
    document.addEventListener('click', this.hideDropdownMenu);
    });
  }

  hideDropdownMenu() {
    this.setState({ listVisible: false }, () => {
      document.removeEventListener('click', this.hideDropdownMenu);
    });

  }

  render() {
    let selecText = this.props.selected.length > 0 ? this.props.selected: this.props.defaultValue;
    return (
      <div className={`dropdown-container ${this.state.listVisible ? "show" : ""}`}>
        <div className={`dropdown-display ${this.state.listVisible ? "clicked": ""}`} onClick={this.showDropdownMenu}>
          <span>{selecText}</span>
          <i className="angle-down"></i>
        </div>
        <div className="dropdown-list" style={{display: `${this.state.listVisible?"block":"none"}`}}>
          <ul>
            <li onClick={this.select.bind(this, null)}>
              <a><span>{this.props.defaultValue}</span></a>
            </li>
            {this.props.list.map((elem:any, index:number)=> {
              let getValue = this.props.flag === 0 ? elem.City : elem.Town;
              return (
                <li key={index} onClick={this.select.bind(this, elem)}>
                  <a><span>{getValue}</span></a>
                </li>)
            })}
          </ul>
        </div>
      </div>
    );
  }
}

export default Select;