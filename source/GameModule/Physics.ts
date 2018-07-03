import { Point, Vector } from 'flatten-js';

const Box2D = require('box2dweb');

const b2Common = Box2D.Common;
const b2Math = Box2D.Common.Math;
const b2Collision = Box2D.Collision;
const b2Shapes = Box2D.Collision.Shapes;
const b2Dynamics = Box2D.Dynamics;
const b2Contacts = Box2D.Dynamics.Contacts;
const b2Controllers = Box2D.Dynamics.Controllers;
const b2Joints = Box2D.Dynamics.Joints;

const b2Vec2 = b2Math.b2Vec2;
const b2BodyDef = b2Dynamics.b2BodyDef;
const b2FixtureDef = b2Dynamics.b2FixtureDef;
const b2World = b2Dynamics.b2World;
const b2CircleShape = b2Shapes.b2CircleShape;

export default class Physics {
    private world: Box2D.Dynamics.b2World;
    private objects: Map<number, Box2D.Dynamics.b2Body>;
    private movements: Map<number, Box2D.Common.Math.b2Vec2>;

    public constructor() {
        this.createWorld();
        this.objects = new Map();
    }

    public addObject(id: number, position: Point, dynamic: boolean = true, shape = null) {
        const fixtureDef = new b2FixtureDef();
        fixtureDef.density = 1.0;
        fixtureDef.friction = 1.0;
        fixtureDef.restitution = 0.5;
        fixtureDef.shape = new b2CircleShape(0.5);

        const bodyDef = new b2BodyDef();
        bodyDef.position.Set(position.x, position.y);

        const object = this.world.CreateBody(bodyDef);
        object.CreateFixture(fixtureDef);

        // TODO: Right way to use maps in js?
        this.objects[id] = object;
    }

    public addMovement(id: number, direction: Vector) {
        this.movements[id] = new b2Vec2(direction.x, direction.y);
    }

    public simulate(time: number = 5) {
        for (const [id, obj] of this.objects) {
            obj.ApplyForce(this.movements[id], obj.GetPosition());
        }

        this.world.Step(time, 8, 3);
    }

    public get positions(): Map<number, Point> {
        const positions: Map<number, Point> = new Map();

        for (const [id, obj] of this.objects) {
            const pos = obj.GetPosition();
            positions[id] = new Point(pos.x, pos.y);
        }

        return positions;
    }

    private createWorld() {
        const gravity = new b2Vec2(0, 0);
        this.world = new b2World(gravity, true);
    }
}
