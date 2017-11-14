import { default as computed } from 'ember-addons/ember-computed-decorators';
import DiscourseURL from 'discourse/lib/url';
import { ajax } from 'discourse/lib/ajax';

export default Ember.Controller.extend({
  statusBannerResultHours: Discourse.SiteSettings.elections_status_banner_default_result_hours,
  statusBanner: Discourse.SiteSettings.elections_status_banner,

  @computed('position')
  disabled(position) {
    return !position || position.length < 3;
  },

  actions: {
    createElection() {
      let data = {
        category_id: this.get('model.categoryId'),
        position: this.get('position'),
        nomination_message: this.get('nominationMessage'),
        poll_message: this.get('electionMessage'),
        self_nomination_allowed: this.get('selfNominationAllowed'),
        status_banner: this.get('statusBanner'),
        status_banner_result_hours: this.get('statusBannerResultHours')
      };

      if (this.get('sameMessage')) {
        data['poll_message'] = data['nomination_message'];
      }

      this.set('loading', true);
      ajax(`/election/create`, {type: 'POST', data}).then((result) => {
        this.set('loading', false);

        if (result.url) {
          DiscourseURL.routeTo(result.url);
        }
      });
    }
  }
});
