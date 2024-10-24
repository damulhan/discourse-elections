import { createWidget } from 'discourse/widgets/widget';
import { ajax } from 'discourse/lib/ajax';
import { h } from 'virtual-dom';

export default createWidget('election-list', {
  tagName: 'div.election-list',
  buildKey: () => 'election-list',

  defaultState() {
    return {
      elections: [],
      loading: true,
    };
  },

  getElections() {
    const { category } = this.attrs;

    if (!category) {
      this.setState({ loading: false });
      return;
    }

    ajax(`/election/category-list`, { data: { category_id: category.id } })
      .then((elections) => {
        this.setState({ elections, loading: false });
      })
      .catch(() => {
        // Handle error if necessary
        this.setState({ loading: false });
      });
  },

  html(attrs, state) {
    const { elections, loading } = state;
    const contents = [h('span', `${I18n.t('election.list.label')}: `)];

    if (loading) {
      this.getElections();
    } else if (elections.length > 0) {
      contents.push(
        h('ul', elections.map((e, i) => {
          const item = [];

          if (i > 0) {
            item.push(h('span', ', '));
          }

          item.push(h('a', { href: e.relative_url }, h('span', e.position)));

          return h('li', item);
        }))
      );
    }

    return contents;
  },
});


// import { createWidget } from 'discourse/widgets/widget';
// import { ajax } from 'discourse/lib/ajax';
// import { h } from 'virtual-dom';

// export default createWidget('election-list', {
//   tagName: 'div.election-list',
//   buildKey: () => 'election-list',

//   defaultState() {
//     return {
//       elections: [],
//       loading: true
//     };
//   },

//   getElections() {
//     const category = this.attrs.category;

//     if (!category) {
//       this.state.loading = false;
//       this.scheduleRerender();
//       return;
//     }

//     ajax(`/election/category-list`, { data: { category_id: category.id }}).then((elections) => {
//       this.state.elections = elections;
//       this.state.loading = false;
//       this.scheduleRerender();
//     });
//   },


//   html(attrs, state) {
//     const elections = state.elections;
//     const loading = state.loading;
//     let contents = [h('span', `${I18n.t('election.list.label')}: `)];

//     if (loading) {
//       this.getElections();
//     } else if (elections.length > 0) {
//       contents.push(h('ul', elections.map((e, i) => {
//         let item = [];

//         if (i > 0) {
//           item.push(h('span', ', '));
//         }

//         item.push(h('a', { href: e.relative_url }, h('span', e.position)));

//         return h('li', item);
//       })));
//     }

//     return contents;
//   }
// });
