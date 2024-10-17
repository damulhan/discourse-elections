import Component from "@glimmer/component";
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { ajax } from 'discourse/lib/ajax';

import ElectionSave from './election-save';

export default class ElectionSaveUsernamesComponent extends ElectionSave {
  layoutName = 'components/election-save';

  @tracked usernamesString = '';
  @tracked showSelector = false;

  @action
  save() {
    const data = this.prepareData();
    if (!data) return;

    const handleFail = () => {
      const existing = this.topic.election_nominations_usernames;
      this.usernamesString = existing.join(',');

      // this is hack to get around stack overflow issues with user-selector's canReceiveUpdates property
      this.showSelector = false;
      Ember.run.scheduleOnce('afterRender', () => this.showSelector = true);
    };

    ajax('/election/nomination/set-by-username', { type: 'POST', data })
      .then((result) => {
        this.resolve(result, 'usernames');

        if (result.failed) {
          handleFail();
        } else {
          this.topic.election_nominations = result.user_ids;
          this.topic.election_nominations_usernames = result.usernames;
          this.topic.election_is_nominee = result.user_ids.indexOf(this.currentUser.id) > -1;
        }
      })
      .catch((e) => {
        if (e.jqXHR && e.jqXHR.responseText) {
          this.resolveStandardError(e.jqXHR.responseText, 'usernames');
          handleFail();
        }
      })
      .finally(() => this.resolve({}, 'usernames'));
  }
}


// import ElectionSave from './election-save';
// import { ajax } from 'discourse/lib/ajax';

// export default ElectionSave.extend({
//   layoutName: 'components/election-save',

//   actions: {
//     save() {
//       const data = this.prepareData();
//       if (!data) return;


//       const handleFail = () => {
//         const existing = this.get('topic.election_nominations_usernames');
//         this.set('usernamesString', existing.join(','));

//         // this is hack to get around stack overflow issues with user-selector's canReceiveUpdates property
//         this.set('showSelector', false);
//         Ember.run.scheduleOnce('afterRender', this, () => this.set('showSelector', true));
//       };

//       ajax('/election/nomination/set-by-username', { type: 'POST', data }).then((result) => {
//         this.resolve(result, 'usernames');

//         if (result.failed) {
//           handleFail();
//         } else {
//           this.set('topic.election_nominations', result.user_ids);
//           this.set('topic.election_nominations_usernames', result.usernames);
//           this.set('topic.election_is_nominee', result.user_ids.indexOf(this.currentUser.id) > -1);
//         }
//       }).catch((e) => {
//         if (e.jqXHR && e.jqXHR.responseText) {
//           this.resolveStandardError(e.jqXHR.responseText, 'usernames');
//           handleFail();
//         }
//       }).finally(() => this.resolve({}, 'usernames'));
//     }
//   }
// });
