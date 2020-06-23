import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

import * as firebase from 'firebase/app';

@Injectable({
  providedIn:'root'
})
export class FirebaseService {

  constructor(
    private firestore: AngularFirestore
  ) { }

  getData(id : string, collection : string) {
    return this.firestore.collection(collection, ref => ref.where('id', '==', id).limit(1)).snapshotChanges();
  }

  getMovies(id : string, collection : string) {
    if (id === undefined) id = "";
    return this.firestore.collection(collection, ref => ref.where('postBy', '==', id).orderBy('date', 'desc')).snapshotChanges();
  }

  getHotmovie(collection : string) {
    return this.firestore.collection(collection, ref => ref.orderBy("rating", 'desc').limit(1)).snapshotChanges();
  }

  getDatas(collection : string) {
    return this.firestore.collection(collection, ref => ref.orderBy('date', 'desc')).snapshotChanges();
  }

  getUser(name : string, collection : string) {
    return this.firestore.collection(collection, ref => ref.where('name', '==', name).limit(1)).snapshotChanges();
  }

  getUsers(collection : string) {
    return this.firestore.collection(collection).snapshotChanges();
  }

  getComments(id: string, collection : string) {
    return this.firestore.collection(collection, ref => ref.where('id_com', '==', id).orderBy('date', 'desc')).snapshotChanges();
  }

  getReplys(id: string, collection : string) {
    return this.firestore.collection(collection, ref => ref.where('id_com_re', '==', id).orderBy('date', 'desc')).snapshotChanges();
  }

  getHisDes(id: string, collection : string) {
    return this.firestore.collection(collection, ref => ref.where('id_mov', '==', id).orderBy('date', 'desc')).snapshotChanges();
  }

  getHisGen(id: string, collection : string) {
    return this.firestore.collection(collection, ref => ref.where('id_mov', '==', id).orderBy('date', 'desc')).snapshotChanges();
  }

  addData(id: string, collection : string, data) {
    return this.firestore.collection(collection).doc(id).set(data);
  }

  changeSname(id : string, collection : string, arr) {
    return this.firestore.collection(collection).doc(id).update({s_name: arr});
  }

  searchData(name: string, collection : string) {
    return this.firestore.collection(collection, ref => ref.where('s_name', 'array-contains', name).orderBy('date', 'desc')).snapshotChanges();
  }

  selectGenre(genre: string, collection : string) {
    return this.firestore.collection(collection, ref => ref.where('genre', 'array-contains', genre).orderBy('date', 'desc')).snapshotChanges();
  }

  upView(id : string, collection : string) {
    return this.firestore.collection(collection).doc(id).update({view:firebase.firestore.FieldValue.increment(1)});
  }

  removeStar(id : string, collection : string, old) {
    return this.firestore.collection(collection).doc(id).update({star:firebase.firestore.FieldValue.arrayRemove(old)});
  }

  rateStar(id : string, collection : string, name, num) {
    return this.firestore.collection(collection).doc(id).update({star: firebase.firestore.FieldValue.arrayUnion(name+":"+num)});
  }

  registerUser(id : string, collection : string, name, email, level, photo, vip) {
    if (vip) {
      const today = new Date();
      const expire = new Date(today.setMonth(today.getMonth() + 1));
      return this.firestore.collection(collection).doc(id).set({name: name, email:email, level:level, status:'Active',photo_url:photo, vip:vip, expire:expire});
    } else return this.firestore.collection(collection).doc(id).set({name: name, email:email, level:level, status:'Active',photo_url:photo, vip:vip, expire:null});
  }

  upStar(id : string, collection : string, star) {
    return this.firestore.collection(collection).doc(id).update({avg_star: star});
  }

  upRating(id : string, collection : string, point) {
    return this.firestore.collection(collection).doc(id).update({rating: point});
  }

  updateReview(id : string, collection : string, des : string, genre) {
    return this.firestore.collection(collection).doc(id).update({des: des, genre: genre});
  }

  resetData(id : string, collection : string) {
    return this.firestore.collection(collection).doc(id).update({avg_star:0,star:[],view:0,id_list:[],id_list_reply:[],id_his_des:[],id_his_gen:[]});
  }

  deleteData(id : string, collection : string) {
    return this.firestore.collection(collection).doc(id).delete();
  }

  deleteComment(id_movie : string, id_comment : string, list_reply) {
    this.firestore.collection("movies").doc(id_movie).update({id_list:firebase.firestore.FieldValue.arrayRemove(id_comment)});
    list_reply.forEach(obj => {
      this.firestore.collection("movies").doc(id_movie).update({id_list_reply:firebase.firestore.FieldValue.arrayRemove(obj)});
    });
    return this.deleteData(id_comment, "comments");
  }

  deleteReply(id_movie : string, id_comment : string, id_reply : string) {
    this.firestore.collection("movies").doc(id_movie).update({id_list_reply:firebase.firestore.FieldValue.arrayRemove(id_reply)});
    this.firestore.collection("comments").doc(id_comment).update({id_list:firebase.firestore.FieldValue.arrayRemove(id_reply)});
    return this.deleteData(id_reply, "replys");
  }

  banUser(name : string, collection : string, status : string) {
    return this.firestore.collection(collection).doc(name).update({status:status});
  }

  editUser(id : string, collection : string, name : string, level : string) {
    if (level == 'Admin') return this.firestore.collection(collection).doc(id).update({level:level,vip:true, expire:null});
    else return this.firestore.collection(collection).doc(id).update({level:level});
  }

  editUserVIP(id : string, collection : string, name : string, vip : string, date) {
    var vip_bool;
    if (vip=='true') vip_bool = true;
    else vip_bool = false;
    if (vip_bool) {
      return this.firestore.collection(collection).doc(id).update({vip:vip_bool, expire:new Date(date)});
    } else return this.firestore.collection(collection).doc(id).update({vip:vip_bool, expire:null});
  }

  updateLevelUser(id : string, collection : string, level : string) {
    return this.firestore.collection(collection).doc(id).update({level:level});
  }

  addComment(id : string, collection : string, data) {
    return this.firestore.collection(collection).doc(id).set(data);
  }

  likeComment(id : string, collection : string, user : string) {
    return this.firestore.collection(collection).doc(id).update({like: firebase.firestore.FieldValue.arrayUnion(user)});
  }

  unlikeComment(id : string, collection : string, user : string) {
    return this.firestore.collection(collection).doc(id).update({like: firebase.firestore.FieldValue.arrayRemove(user)});
  }

  dislikeComment(id : string, collection : string, user : string) {
    return this.firestore.collection(collection).doc(id).update({dislike: firebase.firestore.FieldValue.arrayUnion(user)});
  }

  undislikeComment(id : string, collection : string, user : string) {
    return this.firestore.collection(collection).doc(id).update({dislike: firebase.firestore.FieldValue.arrayRemove(user)});
  }

  editComment(id : string, collection : string, comment : string) {
    return this.firestore.collection(collection).doc(id).update({comment:comment,edit:true});
  }

  editReply(id : string, collection : string, reply : string) {
    return this.firestore.collection(collection).doc(id).update({reply:reply,edit:true});
  }

  addList(id : string, collection : string, old_id : string) {
    return this.firestore.collection(collection).doc(id).update({id_list:firebase.firestore.FieldValue.arrayUnion(old_id)});
  }

  addListReply(id : string, collection : string, old_id : string) {
    return this.firestore.collection(collection).doc(id).update({id_list_reply:firebase.firestore.FieldValue.arrayUnion(old_id)});
  }

  addReply(id : string, collection : string, data) {
    return this.firestore.collection(collection).doc(id).set(data);
  }

  saveHisDes(id : string, collection : string, old_id : string, old_des) {
    return this.firestore.collection(collection).doc(id).set({old_des:old_des,date:firebase.firestore.Timestamp.now(),id_mov:old_id});
  }

  addListHisDes(id : string, collection : string, old_id : string) {
    return this.firestore.collection(collection).doc(id).update({id_his_des:firebase.firestore.FieldValue.arrayUnion(old_id)});
  }

  saveHisGen(id : string, collection : string, old_id : string, old_genre) {
    return this.firestore.collection(collection).doc(id).set({old_genre:old_genre,date:firebase.firestore.Timestamp.now(),id_mov:old_id});
  }

  addListHisGen(id : string, collection : string, old_id : string) {
    return this.firestore.collection(collection).doc(id).update({id_his_gen:firebase.firestore.FieldValue.arrayUnion(old_id)});
  }

  contactus(id, collection, name, text) {
    return this.firestore.collection(collection).doc(id).set({id:id,name:name,text:text,date:firebase.firestore.Timestamp.now()});
  }

  buyVip(id, collection) {
    const today = new Date();
    const expire = new Date(today.setMonth(today.getMonth() + 1));
    return this.firestore.collection(collection).doc(id).update({vip:true, expire:expire});
  }

  expireVip(id, collection) {
    return this.firestore.collection(collection).doc(id).update({vip:false, expire:null});
  }
}