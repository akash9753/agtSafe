import React, { Component } from 'react';
import { timeDifference } from '../../helpers/utility';
import Button from '../../components/uielements/button';
import { InputSearch } from '../../components/uielements/input';
import { NewListWrapper } from './newListComponent.style';

function filterNotes(domains, search) {
  search = search.toUpperCase();
  if (search) {
      return domains.filter(domain => domain.domain.toUpperCase().includes(search));
  }
  return domains;
}
export default class domainList extends Component {
  constructor(props) {
    super(props);
    this.singleDomain = this.singleDomain.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onDomainClicked = this.onDomainClicked.bind(this);
    this.state = {
        search: '',
        selectedId: ''
    };
  }
  singleDomain(domain) {
        const { selectedId } = this.state;
        const colors = ["#7ED321", "#de1b1b", "#511E78", "#ff9009", "#42a5f5"];
        const activeClass = selectedId === domain.domain ? 'active' : '';
        const onClick = () => this.onDomainClicked(domain.domain);
      const variable = this.props.variables.filter(variable => variable.cdiscDataStdDomainMetadataID == domain.cdiscDataStdDomainMetadataID);
        return (
          <div className={`isoList ${activeClass}`} key={domain.domain}>
            <div
              className="isoNoteBGColor"
              style={{ width: '5px', background: colors[0] }}
            />
            <div className="isoNoteText" onClick={onClick}>
                    <h3 name={domain.domain + "_List"}>{domain.domain}</h3>
              <span className="isoNoteCreatedDate">
                        {domain.domainDescription + "-" + variable.length+" Variable(s)"}
              </span>
            </div>
          </div>
        );
  }
  onChange(event) {
    this.setState({ search: event.target.value });
  }
  onDomainClicked(selectedId) {
        this.setState({ selectedId: selectedId });
        this.props.fnToViewDomain(selectedId);
  }
  render() {
    const { search } = this.state;
    const domains = filterNotes(this.props.domains, search);
    return (
        <NewListWrapper className="isoNoteListWrapper" style={{ height: 'calc(100vh - 50px)' }}>
        <InputSearch
         placeholder="Search Domain"
          allowClear
          className="isoSearchNotes"
          value={search}
          onChange={this.onChange}
          name="Domain Search"
        />
            <div className="isoNoteList" style={{height: 'calc(100% - 95px)'}}>
          {domains && domains.length > 0 ? (
            domains.map(domain => this.singleDomain(domain))
          ) : (
            <span className="isoNotlistNotice">No domain found</span>
          )}
        </div>
      </NewListWrapper>
    );
  }
}
