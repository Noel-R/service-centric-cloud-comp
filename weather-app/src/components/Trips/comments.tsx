import { siteContext } from "@/app/page";
import React, { use, useContext, useEffect, useState } from "react";
import Loading from "../loading";
import { RatingEntity, TripEntity } from "./trip";
import Button from "../button";


type CommentProps = {
    uuid: string;
    user: string;
    rating: number;
    comment?: string;
    odd?: boolean;
}

const Comment = (props: CommentProps) => {
    const { uuid, user, rating, comment, odd } = props;
    
    return comment && comment?.length > 0 ? (
        <div id={"comment-" + uuid} className={["chat my-4 ", odd ? " chat-end" : " chat-start"].toLocaleString()}>
        <div className="chat-image tooltip tooltip-top" data-tip={user}>
            <div className="avatar mask mask-squircle">
                <a className="btn text-5xl font-bold w-12 m-auto bg-neutral text-neutral-content text-center">{user[0]}</a>
            </div>
        </div>
        <div className={"chat-bubble"} >
            {comment}
            <div className="badge mask mask-heart bg-orange-400 text-white font-bold absolute -right-4 -top-4 text-center text-lg p-4">{rating}</div>
        </div>
        </div>
    ) : (
        <div id={"comment-" + uuid} className={["chat ", odd ? " chat-end" : " chat-start"].toLocaleString()}>
            <div className="chat-image tooltip tooltip-top" data-tip={user}>
                <div className="avatar mask mask-squircle">
                    <a className="btn text-5xl font-bold w-12 m-auto bg-neutral text-neutral-content text-center">{user[0]}</a>
                </div>
            </div>
            <div className="chat-bubble rating rating-md">
                <input readOnly type="radio" name={"rating-" + uuid} className="mask mask-star-2 bg-orange-400" checked={rating == 1} />
                <input readOnly type="radio" name={"rating-" + uuid} className="mask mask-star-2 bg-orange-400" checked={rating == 2} />
                <input readOnly type="radio" name={"rating-" + uuid} className="mask mask-star-2 bg-orange-400" checked={rating == 3} />
                <input readOnly type="radio" name={"rating-" + uuid} className="mask mask-star-2 bg-orange-400" checked={rating == 4} />
                <input readOnly type="radio" name={"rating-" + uuid} className="mask mask-star-2 bg-orange-400" checked={rating == 5} />
            </div>
        </div>
    )
};

type CommentsProps = {
    trip: TripEntity;
}

const Comments = (props: CommentsProps) => {
    const { trip } = props;
    const { userContext, pageContext } = useContext(siteContext);

    const [ mounted, setMounted ] = useState(false);
    const [ ratings, setRatings ] = useState<RatingEntity[]>(trip.ratings);

    useEffect(() => {
        setMounted(() => true)
    }, []);

    return mounted ? (
        <div id={"trip-comments-" + trip.uuid} className="collapse bg-gray-100 mx-2 w-auto">
            <input type="checkbox" />
            <div className="collapse-title text-xl font-medium">Comments</div>
            <div className="collapse-content">
                <div className="w-auto m-auto">
                {ratings.length > 0 ? ratings.map((rating: RatingEntity, index: number) => {
                    return <Comment key={rating.uuid} uuid={rating.uuid} user={rating.user.name} rating={rating.value} comment={rating.comment} odd={index % 2 == 0} />
                }) : <div className="text-center text-xl font-medium">No comments yet</div>}
                </div>
                <AddComment comments={ratings} setComments={setRatings} tripId={trip.uuid} />
            </div>
        </div>
    ) : <Loading />;
}

type AddCommentProps = {
    comments: RatingEntity[];
    setComments: React.Dispatch<React.SetStateAction<RatingEntity[]>>;
    tripId: string;
}

const AddComment = (props: AddCommentProps) => {
    const { comments, setComments, tripId } = props;
    const { userContext, pageContext } = useContext(siteContext);

    const [ mounted, setMounted ] = React.useState(false);
    const [ comment, setComment ] = React.useState<string>("");
    const [ rating, setRating ] = React.useState<number>(1);

    useEffect(() => {
        setMounted(() => true);
    }, []);

    const onPost = async () => {
        const res = await fetch(`/api/ratings?trip=` + tripId, {method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify({user: userContext.user.uuid, value: rating, comment: comment})})
            .then(res => res.json());
        switch (res.status) {
            case "ok":
                setComments(() => [...comments, res.rating]);
                setComment(() => "");
                setRating(() => 1);
                break;
            case "error":
                break;
            default:
                break;
        }
    }

    return mounted ? (
        <>
        <div className="divider divider-horizontal"></div>
        <div className="flex flex-row w-full m-auto flex-nowrap bg-gray-50 rounded-2xl p-2">
            <label className={"form-control"}>
                <textarea placeholder="Type your comment here..." value={comment} className="textarea textarea-xs max-w-xs bg-gray-200 focus:bg-gray-300"  onChange={(e) => setComment(() => e.target.value)} />
            </label>
            <div className="rating rating-sm m-auto mb-4">
                <input type="radio" onChange={() => setRating(() => 1)} name={"rating-addComment-" + tripId} className="mask mask-star-2 bg-orange-400" checked={rating == 1} />
                <input type="radio" onChange={() => setRating(() => 2)} name={"rating-addComment-" + tripId} className="mask mask-star-2 bg-orange-400" checked={rating == 2} />
                <input type="radio" onChange={() => setRating(() => 3)} name={"rating-addComment-" + tripId} className="mask mask-star-2 bg-orange-400" checked={rating == 3} />
                <input type="radio" onChange={() => setRating(() => 4)} name={"rating-addComment-" + tripId} className="mask mask-star-2 bg-orange-400" checked={rating == 4} />
                <input type="radio" onChange={() => setRating(() => 5)} name={"rating-addComment-" + tripId} className="mask mask-star-2 bg-orange-400" checked={rating == 5} />
            </div>
            <Button text="Post" onClick={() => onPost()} classes=" btn btn-ghost ring ring-info m-auto mb-0" />
        </div>
        </>
    ) : <Loading />;
}

export default Comments;